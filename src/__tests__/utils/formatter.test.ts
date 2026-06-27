import { formatGoldMessage } from '../../utils/formatter';
import { GoldData } from '../../types';

const mockData: GoldData = {
  vnPrice: { buyPrice: 14_500_000, sellPrice: 14_700_000, source: 'sjc' },   // VND/cây
  worldPrice: { askPrice: 4070.25, source: 'goldapi' }, // USD/oz
  exchangeRate: 26_500,
  timestamp: new Date(),
};

describe('formatGoldMessage', () => {
  test('includes VN sell price per cây', () => {
    const msg = formatGoldMessage(mockData);
    expect(msg).toContain('14.700.000');
  });

  test('shows positive delta with up arrow', () => {
    const msg = formatGoldMessage(mockData);
    expect(msg).toContain('📈');
    expect(msg).toContain('+');
  });

  test('lists correct sources', () => {
    const msg = formatGoldMessage(mockData);
    expect(msg).toContain('tygiausd/SJC');
    expect(msg).toContain('goldapi');
  });
});
