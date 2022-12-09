import { hasPathParameter } from './utils';

describe('hasPathParameter', () => {
  it('주어진 경로에 패스 파라미터가 있다면 true 다.', () => {
    const result = hasPathParameter('/api/member/blahData/{id}');

    expect(result).toBe(true);
  });

  it('경로 중간에 패스 파라미터가 있다면 true 다.', () => {
    const result = hasPathParameter('/api/member/{memberId}/modify');

    expect(result).toBe(true);
  });

  it('경로에 패스 파라미터가 없다면 false 다.', () => {
    const result = hasPathParameter('/api/member/blahData/search');

    expect(result).toBe(false);
  });
});
