import React, { useState, useEffect } from "react";
import axios from "axios";

/** imported material Bootstrap */

import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBBtn,
  MDBBtnGroup,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
} from "mdb-react-ui-kit";
import "./App.css";

function App() {
  /** All State */

  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLimit] = useState(10);
  const [sortFilterValue, setSortFilterValue] = useState("");
  const [operation, setOperation] = useState("");

  //** Sorting criteria */

  const sortOption = ["name", "email", "gender", "result"];

  //** Use Effect hook to load the data and it will loadt 10 data per page as 10 passed as end parameter in loadStudentData()  */

  useEffect(() => {
    loadStudentData(0, 10, 0);
  }, []);

  /** loading all student data */

  const loadStudentData = async (
    start,
    end,
    increase,
    optType = null,
    filterorSortValue
  ) => {
    switch (optType) {
      /** Search data with pagination */

      case "search":
        setOperation(optType);
        setSortValue("");
        return await axios
          .get(
            `http://localhost:5000/students?q=${value}&_start=${start}&_end=${end}`
          )
          .then((res) => {
            setData(res.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => console.log(err));

      /** Sorting data with pagination */

      case "sort":
        setOperation(optType);
        setSortFilterValue(filterorSortValue);
        return await axios
          .get(
            `http://localhost:5000/students?_sort=${filterorSortValue}&_order=asc&_start=${start}&_end=${end}`
          )
          .then((res) => {
            setData(res.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => console.log(err));

      /** filtering data with pagination */

      case "filter":
        setOperation(optType);
        setSortFilterValue(filterorSortValue);
        return await axios
          .get(
            `http://localhost:5000/students?result=${filterorSortValue}&_order=asc&_start=${start}&_end=${end}`
          )
          .then((res) => {
            setData(res.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => console.log(err));
      default:
        return await axios
          .get(`http://localhost:5000/students?_start=${start}&_end=${end}`)
          .then((res) => {
            setData(res.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => console.log(err));
    }
  };

  console.log("data", data);

  /** Reseting all data  */

  const handleReset = () => {
    setOperation("");
    setValue("");
    setSortFilterValue("");
    setSortValue("");
    loadStudentData(0, 10, 0);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    loadStudentData(0, 10, 0, "search");
    // return await axios
    //   .get(`http://localhost:5000/students?q=${value}`)
    //   .then((res) => {
    //     setData(res.data);
    //     setValue("");
    //   })
    //   .catch((err) => console.log(err));
  };

  const handleSort = async (e) => {
    let value = e.target.value;
    setSortValue(value);
    loadStudentData(0, 10, 0, "sort", value);
    // return await axios
    //   .get(`http://localhost:5000/students?_sort=${value}&_order=asc`)
    //   .then((res) => {
    //     setData(res.data);
    //   })
    //   .catch((err) => console.log(err));
  };

  const handleFilter = async (value) => {
    loadStudentData(0, 10, 0, "filter", value);
    // return await axios
    //   .get(`http://localhost:5000/students?result=${value}`)
    //   .then((res) => {
    //     setData(res.data);
    //   })
    //   .catch((err) => console.log(err));
  };

  /** Pagination  */

  const renderPagination = () => {
    if (data.length < 10 && currentPage === 0) return null;
    if (currentPage === 0) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadStudentData(10, 20, 1, operation, sortFilterValue)
              }
            >
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else if (currentPage < pageLimit - 1 && data.length === pageLimit) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadStudentData(
                  (currentPage - 1) * 10,
                  currentPage * 10,
                  -1,
                  operation,
                  sortFilterValue
                )
              }
            >
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadStudentData(
                  (currentPage + 1) * 10,
                  (currentPage + 2) * 10,
                  1,
                  operation,
                  sortFilterValue
                )
              }
            >
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadStudentData(
                  (currentPage - 1) * 10,
                  currentPage * 10,
                  -1,
                  operation,
                  sortFilterValue
                )
              }
            >
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
        </MDBPagination>
      );
    }
  };

  return (
    <MDBContainer>
      {/** Search bar and reset button */}

      <form className="form d-flex input-group w-auto" onSubmit={handleSearch}>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Student Details"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <MDBBtn type="submit" color="dark">
          Search
        </MDBBtn>
        <MDBBtn className="mx-1" color="info" onClick={() => handleReset()}>
          Reset
        </MDBBtn>
      </form>

      {/** Sorting and filter acording to result button and condition used if no data is there it will be hidden*/}

      {data.length > 0 && (
        <MDBRow>
          <MDBCol size="8">
            <h5>Sort By :</h5>
            <select className="sorting" onChange={handleSort} value={sortValue}>
              <option>Select Value</option>
              {sortOption.map((item, index) => (
                <option value={item} key={index}>
                  {item}
                </option>
              ))}
            </select>
          </MDBCol>
          <MDBCol size="4">
            <h5>Filter By Result:</h5>
            <MDBBtnGroup>
              <MDBBtn color="success" onClick={() => handleFilter("Passed")}>
                Passed
              </MDBBtn>
              <MDBBtn
                color="danger"
                style={{ marginLeft: "2px" }}
                onClick={() => handleFilter("Failed")}
              >
                Failed
              </MDBBtn>
            </MDBBtnGroup>
          </MDBCol>
        </MDBRow>
      )}

      {/** Student data Table */}

      <div className="wrapper">
        <h2 className="text-center text-dark">Student Data</h2>
        <MDBRow>
          <MDBCol size="12px">
            <MDBTable className="table align-middle mb-0 bg-white">
              <MDBTableHead className="bg-info text-light">
                <tr>
                  <th scope="col">Id.</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Mark Scored</th>
                  <th scope="col">Total Mark</th>
                  <th scope="col">Result</th>
                </tr>
              </MDBTableHead>

              {/** if no data available it will show no data found */}

              {data.length === 0 ? (
                <MDBTableBody className="align-center mb-0">
                  <tr>
                    <td className="text-center mb-0" colSpan={8}>
                      No Data Found
                    </td>
                  </tr>
                </MDBTableBody>
              ) : (
                data.map((item, index) => (
                  <MDBTableBody key={index}>
                    <tr>
                      <th scope="row">{item.id}</th>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.gender}</td>
                      <td>{item.mark}</td>
                      <td>{item.totalmark}</td>
                      {item.result === "Passed" ? (
                        <td className="text-success fw-bold">{item.result}</td>
                      ) : (
                        <td className="text-danger fw-bold">{item.result}</td>
                      )}
                    </tr>
                  </MDBTableBody>
                ))
              )}
            </MDBTable>
          </MDBCol>
        </MDBRow>

        {/** Perform the pagination */}

        <div className="pagination">{renderPagination()}</div>
      </div>
    </MDBContainer>
  );
}

export default App;
