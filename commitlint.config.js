/**
 * feat: 新功能
 * fix: 修补某功能的bug
 * perf: 优化相关，比如提升性能、体验
 * refactor: 重构某个功能
 * revert: 回滚到上一个版本
 * style: 仅样式改动
 * docs: 仅文档新增/改动
 * chore: 构建过程或辅助工具的变动
 * test: 测试用例修改
 */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "docs",
        "chore",
        "test",
      ],
    ],
    "type-case": [0],
    "type-empty": [0],
    "scope-empty": [0],
    "scope-case": [0],
    "subject-full-stop": [0, "never"],
    "subject-case": [0, "never"],
    "header-max-length": [0, "always", 72],
  },
};
