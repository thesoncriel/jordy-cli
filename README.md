# jordy-cli

[jordy](https://github.com/thesoncriel/jordy) 라이브러리와 함께 업무용 프론트엔드 프로젝트 아키텍처에서 쓰이는 CLI 도구입니다.

현재 개발 중입니다. 😅

## 설치

```sh
$ npm install jordy-cli
```

프로젝트 내 `package.json` 에 아래와 같은 스크립트 명령어를 추가합니다.

```json
{
  "scripts": {
    "cli": "jordy-cli"
  },
}
```

## 실행

아래는 기능 모듈(feature module) 생성 예시입니다.

```sh
npm run cli feat lookpin userQuestion
```

아래는 vscode 에서 쓰이는 공용 스니펫(snippets)을 복사합니다.

```sh
npm run cli snippets
```
