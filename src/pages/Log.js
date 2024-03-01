import React from "react";
import { } from "@fortawesome/react-fontawesome";
import { } from '@fortawesome/free-solid-svg-icons';
import { Col, Button } from '@themesberg/react-bootstrap';
import { SalesValueWidget, SalesValueWidgetPhone } from "../components/Widgets";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from "axios"
import { io } from "socket.io-client"

export default () => {

  const products = [{ name: "Akif", surname: "ozdemir" }]
  const socket = io("http://localhost:5000/")

  setInterval(() => {
    

  }, 1000); 

  const handleClick = () => {
    axios.get('http://localhost:5000/')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Hata:', error);
      });

    axios.post('http://localhost:5000/', products[0])
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Hata:', error);
      });
  }

  return (
    <>
      <Col xs={12} className="mb-4 d-none d-sm-block">
        <SalesValueWidget
          title="Sales Value"
          value="10,567"
          percentage={10.57}
        />
      </Col>
      <Col xs={12} className="mb-4 d-sm-none">
        <SalesValueWidgetPhone
          title="Sales Value"
          value="10,567"
          percentage={10.57}
        />
      </Col>

      <DataTable value={products} stripedRows tableStyle={{ minWidth: '50rem' }}>
        <Column field="surname" header="Code"></Column>
        <Column field="name" header="Name"></Column>

      </DataTable>

      <Button onClick={handleClick}>asd</Button>
    </>
  );
};
