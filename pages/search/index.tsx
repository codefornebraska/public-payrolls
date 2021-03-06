import React, { useEffect, useState } from "react";
import {
  getAgenciesByName,
  getEmployeesByName,
} from "../../api/public-payroll-api";
import { useRouter } from "next/router";
import { Typography } from "@material-ui/core";
import Head from "next/head";
import TopEarnersTable from "../../components/TopEarnersTable";
import AgenciesTable from "../../components/AgenciesTable";
import SearchPageSkeleton from "../../components/SearchPageSkeleton";

export default function SearchResults() {
  const router = useRouter();
  const { q } = router.query;
  const [state, setState] = useState({
    agencies: [],
    employees: [],
    loading: false,
  });
  useEffect(() => {
    async function fetchData(searchTerm: string) {
      setState({ ...state, loading: true });
      const [agencyResponse, employeesResponse] = await Promise.all([
        getAgenciesByName(searchTerm),
        getEmployeesByName(searchTerm),
      ]);
      setState({
        agencies: agencyResponse,
        employees: employeesResponse,
        loading: false,
      });
    }
    if (typeof q === "string") {
      fetchData(q).then();
    }
  }, [q]);

  const { agencies, employees, loading } = state;

  const searchResults = () =>
    agencies.length || employees.length ? (
      <div>
        <Head>
          <title>Neb. Public Payrolls</title>
        </Head>
        <div>
          {agencies.length > 0 && <AgenciesTable agencies={agencies} />}
          {employees.length > 0 && (
            <TopEarnersTable employees={employees} title={"Employees"} />
          )}
        </div>
      </div>
    ) : (
      <Typography
        variant={"h6"}
        style={{ marginTop: 120, textAlign: "center" }}
      >
        No results found for {q}. Try another search.
      </Typography>
    );
  return loading ? <SearchPageSkeleton /> : searchResults();
}
