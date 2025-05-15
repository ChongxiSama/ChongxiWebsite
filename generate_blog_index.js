const fs = require('fs');
const path = require('path');

const fileListPath = process.argv[2];
const outputPath = process.argv[3];

if (!fileListPath || !outputPath) {
  console.error('Usage: node generate_blog_index.js <fileList.txt> <output.json>');
  process.exit(1);
}

const files = fs.readFileSync(fileListPath, 'utf-8').split('\n').filter(Boolean);

const blogIndex = files.map(file => {
  const content = fs.readFileSync(file, 'utf-8');
  
  // 简单从html标题标签提取标题
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : path.basename(file);

  // 取日期从文件路径或文件名中提取，示例假设路径含日期目录，如 blog/2025-05-15-xxx.html
  const dateMatch = file.match(/(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : '';

  return {
    url: file.replace(/^blog\//, ''),  // 方便前端用相对路径访问
    title,
    date
  };
});

// 按日期降序排序
blogIndex.sort((a, b) => b.date.localeCompare(a.date));

// 写入JSON
fs.writeFileSync(outputPath, JSON.stringify(blogIndex, null, 2));
console.log(`Generated ${outputPath} with ${blogIndex.length} entries.`);
