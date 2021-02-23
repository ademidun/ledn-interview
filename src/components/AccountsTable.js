import React from 'react';
import { Table, Input, Button, Space } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { ACCOUNTS, COUNTRIES, MFA_TYPES } from '../data/accounts';
import { CSVLink } from "react-csv";

class AccountsTable extends React.Component {
    state = {
        searchText: '',
        searchedColumn: '',
        filteredInfo: {},
        sortedInfo: {},
        visibleAccountsData: ACCOUNTS,
      };

    handleChange = (pagination, filters, sorter, extra) => {

    console.log('Various parameters', pagination, filters, sorter, extra);
    this.setState({
        filteredInfo: filters,
        sortedInfo: sorter,
        visibleAccountsData: extra.currentDataSource
    });
    };

    clearFilters = () => {
    this.setState({ filteredInfo: {} });
    };

    clearAll = () => {
    this.setState({
        filteredInfo: {},
        sortedInfo: {},
    });
    };
    

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({ closeDropdown: false });
                  this.setState({
                    searchText: selectedKeys[0],
                    searchedColumn: dataIndex,
                  });
                }}
              >
                Filter
              </Button>
            </Space>
          </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
          record[dataIndex]
            ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : '',
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select(), 100);
          }
        },
        render: text =>
        this.state.filteredInfo && this.state.filteredInfo[dataIndex] && this.state.searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[this.state.searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
        searchText: selectedKeys[0],
        searchedColumn: dataIndex,
    });
    };

    handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
    };

    render() {

        const { visibleAccountsData } = this.state;
        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        // leaving the console.log statements to make it easier for others to understand
        // what is happening in the code.
        // In real production code, this would be removed.
        console.log({ACCOUNTS, sortedInfo, filteredInfo});
        const dataSource = ACCOUNTS;
          

        // set email as the key because that is the one attribtue that is
        // most likely to be unique for each user
        const columns = [
            {
                title: "First Name",
                dataIndex: "First Name",
                key: "First Name",
                ...this.getColumnSearchProps('First Name'),
                filteredValue: filteredInfo["First Name"] || null,
            },
            {
                title: "Last Name",
                dataIndex: "Last Name",
                key: "Last Name",
                ...this.getColumnSearchProps('Last Name'),
                filteredValue: filteredInfo["Last Name"] || null,
            },
            {
                title: "Country",
                dataIndex: "Country",
                key: "Country",
                filters: COUNTRIES,
                filteredValue: filteredInfo.Country || null,
                onFilter: (value, record) => record.Country.indexOf(value) === 0,
            },
            {
                title: "email",
                dataIndex: "email",
                key: "email",
            },
            {
                title: "Date of Birth",
                dataIndex: "dob",
                key: "dob",
            },
            {
                title: "Multi-Factor Authentication",
                dataIndex: "mfa",
                key: "mfa",
                filters: MFA_TYPES,
                filteredValue: filteredInfo.mfa || null,
                onFilter: (value, record) => record.mfa.indexOf(value) === 0,
            },
            {
                title: "Ledn Tokens",
                dataIndex: "amt",
                key: "amt",
                render: data => !!data ? data.toLocaleString() : data,
                sorter: {
                    compare: (a, b) => a.amt - b.amt,
                    multiple: 1,
                },
                sortOrder: sortedInfo.columnKey === 'amt' && sortedInfo.order,
            },
            {
                title: "Date Created",
                dataIndex: "createdDate",
                key: "createdDate",
                sorter: {
                    compare: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
                    multiple: 2,
                },
                sortOrder: sortedInfo.columnKey === 'createdDate' && sortedInfo.order,
            },
            {
                title: "Referred By",
                dataIndex: "ReferredBy",
                key: "ReferredBy",
            },
        ]

        const hasFilteredInfo = Object.keys(filteredInfo).length > 0;
        const hasSortedInfo = Object.keys(filteredInfo).length > 0;
       
        return(
            <div>
                <h1>Ledn User</h1>

                <Space style={{ marginBottom: 16 }}>
                    <Button onClick={this.clearFilters} disabled={!hasFilteredInfo}>
                        Clear filters
                    </Button>
                    <Button onClick={this.clearAll} disabled={!hasFilteredInfo || !hasSortedInfo}>
                        Clear filters and sorters
                    </Button>
                    <Button>
                    <CSVLink data={visibleAccountsData}
                             filename={"ledn-accounts.csv"}>
                    Download as CSV
                    </CSVLink>

                    </Button>

                </Space>

                <Table dataSource={dataSource} columns={columns} rowKey="email"
                       onChange={this.handleChange} />
            </div>
        )
    }
}

export default AccountsTable