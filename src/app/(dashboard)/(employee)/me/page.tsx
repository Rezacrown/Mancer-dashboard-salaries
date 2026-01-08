import Top_grid from "@/modules/me/top-grid";
import Wallet_balance from "@/modules/me/wallet-balance";
import TransactionSection from "@/modules/me/transaction";
import PageT_title from "@/modules/me/page-title";
import List_streaming from "@/modules/me/list-streaming";

const EmployeeDashboardPage = async () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Title */}
      <PageT_title />

      {/* Top Grid */}
      <Top_grid />

      <List_streaming />

      {/* Wallet Balance Section */}
      <Wallet_balance />
      {/* Transactions */}
      <TransactionSection />
    </div>
  );
};

export default EmployeeDashboardPage;
