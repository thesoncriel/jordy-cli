import { appendLogics } from './appendLogics';

const {
  appendWithoutDuplicates: appendWithoutDuplicatesFn,
  appendReducers: appendReducersFn,
} = appendLogics;

describe('appendWithoutDuplicates', () => {
  function appendWithoutDuplicates(arg0: string, arg1: string) {
    return appendWithoutDuplicatesFn(arg0, arg1, null as never);
  }

  it('이전 코드가 비었다면 다음 코드를 내보낸다.', () => {
    const result = appendWithoutDuplicates('\n', 'abc');

    expect(result).toBe('abc');
  });

  it('이전 코드안에 다음 코드가 없다면 덧붙여서 내보낸다.', () => {
    const result = appendWithoutDuplicates(
      `abc
boba
lookpin
`,
      'theson'
    );

    expect(result).toBe('abc\nboba\nlookpin\ntheson\n');
  });

  it('덧붙일 때는 다시 정렬하여 내보낸다.', () => {
    const result = appendWithoutDuplicates(
      `abc
boba
theson
`,
      'lookpin'
    );

    expect(result).toBe('abc\nboba\nlookpin\ntheson\n');
  });

  it('이전 코드안에 다음 코드가 있다면 이전 코드 내용을 그대로 내보낸다.', () => {
    const given = `abc
theson
boba
`;
    const result = appendWithoutDuplicates(given, 'boba');

    expect(result).toBe(given);
  });

  it('결과 코드 마지막 라인이 비어있지 않다면 임의로 빈 라인을 추가한다.', () => {
    const result = appendWithoutDuplicates(
      `abc
boba
theson`,
      'lookpin'
    );

    expect(result).toBe('abc\nboba\nlookpin\ntheson\n');
  });
});

describe('appendReducers', () => {
  function appendReducers(arg0: string, arg1: string) {
    return appendReducersFn(arg0, arg1, null as never);
  }

  it('이전 코드가 비었다면 다음 코드를 내보낸다.', () => {
    const result = appendReducers('\n', 'abc');

    expect(result).toBe('abc');
  });

  it('이전 코드와 다음 코드가 같다면 이전 코드를 내보낸다.', () => {
    const given = `
import A from 'A';
import BReducer from './B/reducers';

export const featRc = {
  shared: A,
  b: BReducer,
};
`;
    const result = appendReducers(given, given);

    expect(result).toBe(given);
  });

  it('두 코드가 다르다면 이전 코드에서 중복된 걸 제외하고 다음 코드를 병합한다.', () => {
    const given0 = `import A from 'A';
import BReducer from './B/reducers';

export const featRc = {
  shared: A,
  b: BReducer,
};
`;
    const given1 = `import A from 'A';
import { thesonReducer } from './theson/reducers';

export const featRc = {
  shared: A,
  theson: thesonReducer,
};
`;
    const expectResult = `import A from 'A';
import BReducer from './B/reducers';
import { thesonReducer } from './theson/reducers';

export const featRc = {
  shared: A,
  b: BReducer,
  theson: thesonReducer,
};
`;
    const result = appendReducers(given0, given1);

    expect(result).toBe(expectResult);
  });

  it('이전 코드 내용이 많아도 의도대로 병합된다.', () => {
    const given0 = `import A from 'A';
import BReducer from './B/reducers';
import { lookpinReducer } from './lookpin/reducers';
import { thesonReducer } from './theson/reducers';


export const myReducer = {
  shared: A,
  b: BReducer,
  lookpin: lookpinReducer,
  theson: thesonReducer,
};
`;
    const given1 = `import A from 'A';
import { orderReducer } from './order/reducers';

export const myReducer = {
  shared: A,
  order: orderReducer,
};
`;
    const expectResult = `import A from 'A';
import BReducer from './B/reducers';
import { lookpinReducer } from './lookpin/reducers';
import { thesonReducer } from './theson/reducers';
import { orderReducer } from './order/reducers';


export const myReducer = {
  shared: A,
  b: BReducer,
  lookpin: lookpinReducer,
  theson: thesonReducer,
  order: orderReducer,
};
`;
    const result = appendReducers(given0, given1);

    expect(result).toBe(expectResult);
  });

  it('다른 타입의 리듀서 병합 코드도 의도대로 병합된다.', () => {
    const given0 = `import { combineReducers } from 'redux';
import { thesonBasicSlice } from './stores';

export const thesonReducer = combineReducers({
  basic: thesonBasicSlice.reducer,
});
    `;
    const given1 = `import { combineReducers } from 'redux';
import { thesonNodeFightSlice } from './stores';

export const thesonReducer = combineReducers({
  nodeFight: thesonNodeFightSlice.reducer,
});
    `;
    const expectResult = `import { combineReducers } from 'redux';
import { thesonBasicSlice } from './stores';
import { thesonNodeFightSlice } from './stores';

export const thesonReducer = combineReducers({
  basic: thesonBasicSlice.reducer,
  nodeFight: thesonNodeFightSlice.reducer,
});
    `;
    const result = appendReducers(given0, given1);

    expect(result).toBe(expectResult);
  });
});
