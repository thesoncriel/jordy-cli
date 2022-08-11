# ts-fe-cli

업무용 프로젝트 아키텍처에서 쓰일 CLI 도구입니다.

개발 중입니다. 😅

## 설치

```sh
$ npm install ts-fe-cli
```

프로젝트 내 `package.json` 에 아래와 같은 스크립트 명령어를 추가합니다.

```json
{
  "scripts": {
    "cli": "ts-fe-cli"
  },
}
```

## 실행

아래는 기능 모듈(feature module) 생성 예시입니다.

```sh
npm run cli feat lookpin userQuestion
```
