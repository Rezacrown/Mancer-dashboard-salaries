interface Props {
  status: "Active" | "Paused" | "Voided";
}

const Badge = ({ status }: Props) => {
  const styles = {
    Active: "bg-green-100 text-green-600 border border-green-200",
    Paused: "bg-yellow-100 text-yellow-600 border border-yellow-200",
    Voided: "bg-gray-100 text-gray-500 border border-gray-200",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
        styles[status] || styles.Voided
      }`}
    >
      {status === "Active" && (
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
      )}
      {status}
    </span>
  );
};

export default Badge;
