import React, { useContext, useState, useRef } from "react";
import useSWR from "swr";
import Layout from "components/layout/Layout";
import TransactionTable from "components/transactions/TransactionTable";
// import AddressTotals from "components/addresses/AddressTotals";
// import AddressPercentBar from "components/addresses/AddressPercentBar";
import UserStats from "components/users/UserStats";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { AuthContext } from "components/auth/Auth";
import PayInformationTable from "components/pay-information/PayInformationTable";
import Card from "components/Card";

import "./Dashboard.scss";

import { CSVLink } from "react-csv";
import { Alert, Button } from "react-bootstrap";
import api from "../apis/api";

const Dashboard = () => {
  const { user, isVerified, hasVerified } = useContext(AuthContext);
  const [year, setYear] = useState(new Date().getFullYear());
  const [transactionsDownload, setTransactionsDowload] = useState([]);
  const [downloadError, setDownloadError] = useState({
    show: false,
    message: ""
  });

  const csvRef = useRef();
  // const { data: referralCredits, error: fetchReferralCreditsError } = useSWR(
  //   "/referralCredits"
  // );

  // const {
  //   data: referralTransfers,
  //   error: fetchReferralTransfersError
  // } = useSWR("/referralTransfer");

  // const { data: depositHints, error: fetchDepositHintsError } = useSWR(
  //   `/user/${user.id}/deposithints`
  // );

  const { data: userDetails, error: fetchDetailsError } = useSWR(
    `/user/${user.id}`
  );

  // const { data: userAddress } = useSWR(user && `/user/${user.id}/address`);

  // // Only if verified
  // const { data: bankDetails, error: fetchBankDetailsError } = useSWR(
  //   isVerified && `/user/${user.id}/bankdetails`
  // );

  const { data: transactions, error: fetchTransactionsError } = useSWR(
    `/interactions/`
  );

  // const { data: userStats, error: fetchStatsError } = useSWR(
  //   "/stats/all"
  // );

  const userStats = {
  };

  // const { data: addressTotals, error: fetchAddressTotalsError } = useSWR(
  //   isVerified && `/user/${user.id}/address/totals`
  // );

  // const { data: archivedAddresses, error: fetchArchivedAddressError } = useSWR(
  //   isVerified && `/user/${user.id}/address?deleted=true`
  // );

  // const { data: activeAddresses, error: fetchActiveAddressError } = useSWR(
  //   isVerified && `/user/${user.id}/address`
  // );

  // const { data: referrals, error: referralsError } = useSWR(
  //   user.id && `/user/${user.id}/referral`
  // );

  // Loading status
  // const isFetchingDepositHints = !depositHints && !fetchDepositHintsError;
  // const isFetchingStats = isVerified && !userStats && !fetchStatsError;

  // const isFetchingBankDetails =
  //   isVerified && !bankDetails && !fetchBankDetailsError;
  // const isFetchingDetails = isVerified && !userDetails && !fetchDetailsError;
  // const isFetchingTransactions =
  //   isVerified && !transactions && !fetchTransactionsError;

  const { data: bankDetails, error: fetchTustDetailsError } = useSWR(
    `/user/1/trust/`
  );

  // const bankDetails = {
  //   name: "Test",
  //   number: "123456789",
  //   bsb: "123456"
  // };

  const isFetching = false;
  const currentYear = new Date().getFullYear();

  const handleDownload = async () => {
    setDownloadError({ show: false, message: "" });
    try {
      if (year) {
        const filterTransactions = await api.secure.get(
          `/transaction/download/${year}`
        );
        if (filterTransactions.data.length > 0) {
          setTransactionsDowload(filterTransactions.data);
          await new Promise((resolve) => setTimeout(resolve, 3000));
          csvRef.current.link.click();
        } else {
          setDownloadError({ show: true, message: "No transactions found" });
        }
      }
    } catch (error) {
      console.error(error);
      setDownloadError({ show: true, message: error.message });
    }
  };

  // const isVerified = true;

  return (
    <Layout activeTab="Dashboard">
      <div className="dashboard container-fluid py-4">
        <Loader loading={false} />
        <section className="main row">
          {/* <div className={isVerified ? "overlay" : "overlay active"} /> */}
          <aside className="col-lg-5">
            <section>
              <Card>
                <h4>Account Details</h4>
                <ErrorMessage error={fetchDetailsError} />
                <Loader loading={isFetching} />
                <UserStats stats={userStats} />
              </Card>
            </section>
            <section>
              <Button
                block
                // variant="link"
                className="mt-2"
                // onClick={() => history.push("/login")}
              >
                Book a call
              </Button>
            </section>

            {/* <section style={{ position: "relative" }}> */}
            <section>
              <Card>
                <h4>Trust Details</h4>
                <p>
                  Transitional Legal Trust Details
                </p>
                <ErrorMessage error={fetchDetailsError} />
                <Loader
                  loading={
                    isFetching
                  }
                />
                <PayInformationTable
                  bankDetails={bankDetails}
                  userDetails={userDetails}
                />
              </Card>
            </section>
            <section>
            <Button
                block
                className="mt-2"
                // onClick={() => history.push("/login")}
              >
                Deposit Crypto
              </Button>
              {/* <Button
                block
                className="mt-2"
              >
                View payments
              </Button> */}
              <Button
                block
                className="mt-2"
                // onClick={() => history.push("/login")}
              >
                Apply for a loan
              </Button>
            </section>
          </aside>
          <section className="content col-lg-7">
            {/* <section style={{ position: "relative" }}>
              <Card>
                <h4>Trust Details</h4>
                <p>
                  Transitional Legal Trust Details
                </p>
                <ErrorMessage error={fetchDetailsError} />
                <Loader
                  loading={
                    isFetching
                  }
                />
                <PayInformationTable
                  bankDetails={bankDetails}
                  userDetails={userDetails}
                />
              </Card>
            </section> */}
            <section style={{ position: "relative" }}>
              <h3>Next interaction</h3>
              <p>Your next Court hearing is with Judge Smith on Thursday, 1st May 2023 via Teams.</p>
              <Button 
                block
                className="mt-2">
                Save to calendar
              </Button>
              <br></br>
              <Card>
                <div className="d-flex flex-row">
                  <div className="mr-auto p-2">
                    <h4>Interactions</h4>
                  </div>
                  <div className="p-2">
                    <select
                      className="form-control"
                      id="downloadYear"
                      onChange={(e) => {
                        setYear(e.target.value);
                      }}
                    >
                      <option>{currentYear}</option>
                      <option>{currentYear - 1}</option>
                      <option>{currentYear - 2}</option>
                    </select>
                  </div>
                  <div className="p-2">
                    <Button onClick={handleDownload}>Download CSV</Button>
                    <CSVLink
                      data={transactionsDownload}
                      filename={"User-transactions.csv"}
                      className="hidden"
                      target="_blank"
                      ref={csvRef}
                    />
                  </div>
                </div>
                {downloadError.show && (
                  <Alert variant="danger">{downloadError.message}</Alert>
                )}
                <ErrorMessage error={fetchTransactionsError} />
                <Loader loading={isFetching} />
                <TransactionTable transactions={transactions} />
              </Card>
              {/* <Card>
                <h4>Payments</h4> */}
                {/* <ErrorMessage error={fetchReferralTransfersError} /> */}
                {/* <Loader loading={isFetching} />
              </Card> */}
            </section>
          </section>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
