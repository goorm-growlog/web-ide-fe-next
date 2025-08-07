module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0], // 커밋 메시지 제목의 대소문자 규칙 비활성화
  },
};
