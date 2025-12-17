interface Props extends React.PropsWithChildren {
  className?: string;
}

const Card = ({ children, className = "" }: Props) => (
  <div
    className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}
  >
    {children}
  </div>
);

export default Card;
