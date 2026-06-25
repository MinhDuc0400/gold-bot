import { formatGoldMessage } from '../../utils/formatter';
import { GoldData } from '../../types';

const mockData: GoldData = {
  vnPrice: { buyPrice: 155_000_000, source: 'sjc' },
  worldPrice: { spotPrice: 4070.25, source: 'metals.live' },
  exchangeRate: 26_500,
  timestamp: new Date(),
};

describe('formatGoldMessage', () => {
  test('includes VN price per cây', () => {
    const msg = formatGoldMessage(mockData);
    // 155_000_000 / 10 = 15_500_000
    expect(msg).toContain('15.500.000');
  });

  test('shows positive delta with up arrow', () => {
    const msg = formatGoldMessage(mockData);
    expect(msg).toContain('📈');
    expect(msg).toContain('+');
  });

  test('lists correct sources', () => {
    const msg = formatGoldMessage(mockData);
    expect(msg).toContain('SJC');
    expect(msg).toContain('metals.live');
  });
});
