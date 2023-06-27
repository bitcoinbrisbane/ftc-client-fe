import React, { useContext, useState, useRef } from "react";
import useSWR from "swr";
import Layout from "components/layout/Layout";
import DocumentTable from "components/documents/DocumentTable";
import TransactionTable from "components/transactions/TransactionTable";
import UserDetails from "components/users/UserDetails";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { AuthContext } from "components/auth/Auth";

import Card from "components/Card";
import "./Dashboard.scss";

import { CSVLink } from "react-csv";
import { Alert, Button, Container } from "react-bootstrap";
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

	const { data: userDetails, error: fetchDetailsError } = useSWR(`/users/${user.email}`);

	const { data: interactions, error: fetchInteractionsError } = useSWR(`/interactions/${user.email}`);

	const { data: documents, error: fetchDocumentsError } = useSWR(`/documents/${user.email}`);

	const { data: bankDetails, error: fetchTustDetailsError } = useSWR(`/users/${user.id}/trust/`);

	const { data: summary, error: fetchSummaryError } = useSWR(`/users/${user.email}/summary`);

	const { data: invoices } = useSWR(`/users/${user.id}/invoices`);

	const isFetching = false;
	const currentYear = new Date().getFullYear();

	const handleDownload = async () => {
		setDownloadError({ show: false, message: "" });
		try {
			if (year) {
				const filterTransactions = await api.secure.get(`/transaction/download/${year}`);
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

	return (
		<Layout activeTab="Dashboard">
			<div className="dashboard container-fluid py-4">
				<Loader loading={false} />

				<div className="container">
					<div className="row text-center justify-content-center mb-5">
						<div className="col-xl-12 col-lg-12">
							<h2>Skinner v Perkins</h2>
							<p className="text-muted">
								Your next Court hearing is with Judge Smith on Thursday, 1st May 2023 via Teams. <b>Click here to download an iCal</b>
							</p>
						</div>
					</div>
				</div>

				<section className="main row">
					{/* <div className={isVerified ? "overlay" : "overlay active"} /> */}
					<aside className="col-lg-5">
						{/* <section>
              <Card>
                <userDetails />
              </Card>
            </section> */}

						<section>
							<Card>
								<h4>Account Details</h4>
								<ErrorMessage error={fetchDetailsError} />
								<Loader loading={isFetching} />
								<UserDetails stats={userDetails} />
							</Card>
						</section>
						<section>
							<Button
								block
								className="mt-2"
								// onClick={() => history.push("/login")}
							>
								Update my details
							</Button>
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
								<h4>Invoices</h4>
								<ErrorMessage error={fetchDetailsError} />
								<Loader loading={isFetching} />
								<p>
									<b>
										RE: Invoice #{invoices?.number} dated {invoices?.issued}
									</b>
								</p>
								<p>Please find enclosed your invoice #{invoices?.number} dated {invoices?.issued}.  Your invoice is ${invoices?.amount} and includes an itemised listing of the work undertaken.</p>
								<p>We would be grateful if you immediately pay the outstanding balance of ${invoices?.amount} owed.</p>
								<p>
									By way of update, we advise the following:
									<ul>
										<li>Work conducted this week</li>
									</ul>
								</p>
								<p>Next Steps:</p>
								<p>
									<ul>
										<li>Progression of matter</li>
										<li>Work to be conducted</li>
										<li>Anticipated costs</li>
									</ul>
								</p>
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
								Apply for finance
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
							<Container>
								<h3>Where things are at ...</h3>
								<p>{summary?.summary}</p>
								<h3>Next steps ...</h3>
								<p>
									{summary?.next_action}
									<b>Click here to add to your calander.</b>
								</p>
								{/* <div className="row">
                  <div className="col">
                    <div
                      className="timeline-steps aos-init aos-animate"
                      data-aos="fade-up"
                    >
                      <div className="timeline-step">
                        <div
                          className="timeline-content"
                          data-toggle="popover"
                          data-trigger="hover"
                          data-placement="top"
                          title=""
                          data-content=""
                          data-original-title="2003"
                        >
                          <div className="inner-circle"></div>
                          <p className="h6 mt-3 mb-1">1/1/2023</p>
                          <p className="h6 text-muted mb-0 mb-lg-0">
                            Application
                          </p>
                        </div>
                      </div>
                      <div className="timeline-step">
                        <div
                          className="timeline-content"
                          data-toggle="popover"
                          data-trigger="hover"
                          data-placement="top"
                          title=""
                          data-content=""
                          data-original-title="2004"
                        >
                          <div className="inner-circle"></div>
                          <p className="h6 mt-3 mb-1">1/2/2023</p>
                          <p className="h6 text-muted mb-0 mb-lg-0">Hearing</p>
                        </div>
                      </div>
                      <div className="timeline-step">
                        <div
                          className="timeline-content"
                          data-toggle="popover"
                          data-trigger="hover"
                          data-placement="top"
                          title=""
                          data-content=""
                          data-original-title="2005"
                        >
                          <div className="inner-circle"></div>
                          <p className="h6 mt-3 mb-1">1/12/2023</p>
                          <p className="h6 text-muted mb-0 mb-lg-0">Trial</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
							</Container>
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
											<option>{currentYear - 3}</option>
										</select>
									</div>
									<div className="p-2">
										<Button onClick={handleDownload}>Download CSV</Button>
										<CSVLink data={transactionsDownload} filename={"User-transactions.csv"} className="hidden" target="_blank" ref={csvRef} />
									</div>
								</div>
								{downloadError.show && <Alert variant="danger">{downloadError.message}</Alert>}
								<ErrorMessage error={fetchInteractionsError} />
								<Loader loading={isFetching} />
								<TransactionTable transactions={interactions} />
							</Card>
							<Card>
								<div className="d-flex flex-row">
									<div className="mr-auto p-2">
										<h4>Documents</h4>
									</div>
									<div className="p-2">
										<Button onClick={handleDownload}>Upload Documents</Button>
									</div>
								</div>
								<ErrorMessage error={fetchDocumentsError} />
								<Loader loading={isFetching} />
								<DocumentTable documents={documents} />
							</Card>
						</section>
					</section>
				</section>
			</div>
		</Layout>
	);
};

export default Dashboard;
