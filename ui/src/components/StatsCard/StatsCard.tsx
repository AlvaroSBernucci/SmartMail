import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { StatsCardInterface } from './StatsCard.types';

function StatsCard({ title, value, icon, color }: StatsCardInterface) {
  return (
    <div className="grid text-start gap-3">
      <p className="text-xs font-bold text-zinc-400">{title}</p>
      <div className="flex justify-between items-center text-xl font-bold w-35">
        <p className="">{value}</p>
        <FontAwesomeIcon icon={icon} style={{ color: color }} />
      </div>
      <p className="text-xs text-zinc-400">Este mês</p>
    </div>
  );
}

export default StatsCard;
