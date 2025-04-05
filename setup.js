#!/usr/bin/env node

/**
 * FABRICVERSE 平台安装脚本
 * 
 * 此脚本会引导用户完成平台的安装和初始设置
 */

const readline = require('readline');
const fs = require('fs');
const crypto = require('crypto');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("\n============================================");
console.log("   FABRICVERSE 平台安装向导");
console.log("============================================\n");

const config = {
  SESSION_SECRET: crypto.randomBytes(32).toString('hex'),
  CHAIN_ID: "1",
  RPC_URL: "",
  TOKEN_EXCHANGE_RATE: "100"
};

function askQuestion(question, defaultValue = '') {
  return new Promise((resolve) => {
    const defaultText = defaultValue ? ` (默认: ${defaultValue})` : '';
    rl.question(`${question}${defaultText}: `, (answer) => {
      resolve(answer || defaultValue);
    });
  });
}

async function collectConfig() {
  console.log("\n1. 基本配置\n");
  
  // 区块链配置
  console.log("设置区块链连接信息（可选）:");
  config.CHAIN_ID = await askQuestion("区块链网络ID", config.CHAIN_ID);
  config.RPC_URL = await askQuestion("RPC URL", config.RPC_URL);
  
  // 代币兑换比率
  console.log("\n设置平台虚拟代币相关参数:");
  config.TOKEN_EXCHANGE_RATE = await askQuestion("代币兑换比率", config.TOKEN_EXCHANGE_RATE);

  return config;
}

function createEnvFile(config) {
  console.log("\n2. 创建环境配置文件\n");
  
  let envContent = '';
  for (const [key, value] of Object.entries(config)) {
    if (value) {
      envContent += `${key}=${value}\n`;
    }
  }
  
  try {
    fs.writeFileSync('.env', envContent);
    console.log("✅ 已创建.env文件");
  } catch (error) {
    console.error("❌ 创建.env文件失败:", error.message);
    process.exit(1);
  }
}

function installDependencies() {
  console.log("\n3. 安装依赖\n");
  
  try {
    console.log("正在安装依赖包...");
    execSync('npm install', { stdio: 'inherit' });
    console.log("✅ 依赖包安装完成");
  } catch (error) {
    console.error("❌ 依赖包安装失败");
    process.exit(1);
  }
}

function buildProject() {
  console.log("\n4. 构建项目\n");
  
  try {
    console.log("正在构建项目...");
    execSync('npm run build', { stdio: 'inherit' });
    console.log("✅ 项目构建完成");
  } catch (error) {
    console.error("❌ 项目构建失败");
    process.exit(1);
  }
}

function showCompletionMessage() {
  console.log("\n============================================");
  console.log("   🎉 FABRICVERSE 平台安装完成!");
  console.log("============================================\n");
  console.log("您可以通过以下命令启动平台:");
  console.log("\n  开发模式:  npm run dev");
  console.log("  生产模式:  npm start\n");
  console.log("测试账户信息:");
  console.log("  买家: buyer@example.com / buyerpass");
  console.log("  租户: tenant@example.com / tenantpass");
  console.log("  管理员: admin@example.com / adminpass\n");
  console.log("详细使用说明请参阅README.md文档");
  console.log("============================================\n");
}

// 主函数
async function main() {
  try {
    const config = await collectConfig();
    createEnvFile(config);
    
    const shouldInstall = await askQuestion("\n是否现在安装依赖包和构建项目? (y/n)", "y");
    if (shouldInstall.toLowerCase() === 'y') {
      installDependencies();
      buildProject();
    }
    
    showCompletionMessage();
  } catch (error) {
    console.error("安装过程中发生错误:", error);
  } finally {
    rl.close();
  }
}

main();