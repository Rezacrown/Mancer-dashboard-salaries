import { type LucideIcon } from "lucide-react";

interface Props {
  icon?: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: Props) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${
      active
        ? "bg-red-50 text-[#F9140D] font-semibold"
        : "text-gray-500 hover:bg-gray-100"
    }`}
  >
    {Icon && <Icon size={20} />}
    <span className="text-sm">{label}</span>
  </div>
);

export default SidebarItem;
