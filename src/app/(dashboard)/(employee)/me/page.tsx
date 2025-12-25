import Top_grid from "@/modules/me/top-grid";
import Wallet_balance from "@/modules/me/wallet-balance";
import TransactionSection from "@/modules/me/transaction";
import PageT_title from "@/modules/me/page-title";

const EmployeeDashboardPage = async () => {
  const streamedBalance = 11377.68;
  const withdrawable = 11120.92;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Title */}
      <PageT_title />

      {/* Top Grid */}
      <Top_grid streamedBalance={streamedBalance} withdrawable={withdrawable} />

      {/* Wallet Balance Section */}
      <Wallet_balance />
      {/* Transactions */}
      <TransactionSection />
    </div>
  );
};

export default EmployeeDashboardPage;
