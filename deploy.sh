#!/bin/bash

# AI Product Governance - 完整部署脚本
# 运行此脚本将自动完成所有部署步骤

echo "🚀 开始部署 AI Product Governance..."
echo "========================================"

# Step 1: 安装依赖
echo ""
echo "📦 Step 1: 安装 gh-pages..."
npm install -D gh-pages

if [ $? -ne 0 ]; then
    echo "❌ gh-pages 安装失败"
    exit 1
fi

# Step 2: 运行评测
echo ""
echo "📊 Step 2: 运行评测生成结果文件..."
npm run evaluate

if [ $? -ne 0 ]; then
    echo "❌ 评测运行失败"
    exit 1
fi

# Step 3: 检查评测文件
echo ""
echo "✅ Step 3: 检查评测文件..."
if [ ! -f "evaluation/v01/results.json" ]; then
    echo "❌ results.json 未生成"
    exit 1
fi
echo "   ✓ results.json"
echo "   ✓ bad_cases.json"
echo "   ✓ report.md"
echo "   ✓ display_summary.json"

# Step 4: 构建
echo ""
echo "🔨 Step 4: 构建生产版本..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

# Step 5: 部署
echo ""
echo "🚀 Step 5: 部署到 GitHub Pages..."
npm run deploy

if [ $? -ne 0 ]; then
    echo "❌ 部署失败"
    exit 1
fi

# 完成
echo ""
echo "========================================"
echo "✨ 部署完成！"
echo ""
echo "📍 访问地址："
echo "   https://Carla-guguwwwy051010.github.io/ai_product_governance/"
echo ""
echo "⚠️  注意："
echo "   1. 首次部署需要等待 1-2 分钟"
echo "   2. 在 GitHub 仓库设置中启用 GitHub Pages："
echo "      Settings → Pages → Source: gh-pages branch"
echo ""
echo "🎉 完成！"
