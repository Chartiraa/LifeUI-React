import React from "react";
import { } from "@fortawesome/react-fontawesome";
import { } from '@fortawesome/free-solid-svg-icons';
import { Col, Button } from '@themesberg/react-bootstrap';
import { SalesValueWidget, SalesValueWidgetPhone } from "../components/Widgets";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { GET, POST} from "../services/Request"


export default () => {

  const products = [{ name: "Akif", surname: "ozdemir" }]

  const handleClick = () => {

      GET('', "Akif")
      POST('', "CAn")

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
