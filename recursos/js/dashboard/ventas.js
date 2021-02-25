import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Menu from '../menu/menu_horizontal'
import { Container, Row, Col, Card, Image, Modal } from 'react-bootstrap'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { Document, Page, pdfjs } from "react-pdf"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const Ventas = () => {
    const [condicionVentas, setCondicionVentas] = useState(true)
    const [ventas, setVentas] = useState([])
    useEffect(() => {
        cargarVentas()
    }, [condicionVentas])
    const cargarVentas = () => {
        fetch('/subagentes/ventaspagado')
            .then(response => response.json())
            .then(data => setVentas(data))
    }
    const [show, setShow] = useState(false)
    const handleClose = () => {
        setShow(false)
    }
    const handleShow = () => {
        setShow(true)
    }

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <Menu modulo="ventas">
            <Container className="mt-2">
                <Row className="d-flex justify-content-center">
                    <Col xs={12} lg={12}>
                        {ventas.map((venta, key_venta) => (
                            <Card className="p-3 my-1" key={key_venta}>
                                <Row className="d-flex align-items-center">
                                    <Col xs={2} lg={1} className="text-center">{venta.id}</Col>
                                    <Col xs={10} lg={3}>
                                        <h5 className="m-0 d-inline"><b>PV. {venta.id_subagente.abreviatura.toUpperCase()}</b></h5> - {venta.fecha_creacion}<br />
                                        <p style={{ lineHeight: '17px' }}>
                                            <small><b>Fecha Operación : </b>{venta.fecha_operacion} <br />
                                                <b>Nº Operación : </b>{venta.nro_operacion}<br />
                                                <b>Banco : </b>{venta.banco}<br />
                                                <b>Fecha Operación : </b>{venta.nombre_cuenta}<br />
                                                <b>Fecha Operación : </b>{venta.observaciones}<br />
                                            </small>
                                        </p>
                                    </Col>
                                    <Col xs={6} lg={3} className="text-center"><a href={venta.ruta} target="_blank"><Image src="./img/pdf.svg" className="inicio_img_pdf" /></a></Col>
                                    <Col xs={6} lg={5} className="text-center">
                                        {venta.nombre_archivo_imagen.map((imagen, key_imagen) => (
                                            <Zoom>
                                                <Image src={`./${venta.ruta_voucher}${imagen}`} key={key_imagen} className="inicio_img_voucher mx-1 my-1" />
                                            </Zoom>
                                        ))}
                                        <button onClick={handleShow}>aqui</button>
                                    </Col>
                                </Row>
                            </Card>
                        ))}
                    </Col>
                </Row>
            </Container>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Body>
                    <Document
                        file="/documentos_subidos/certificados_pv/PV.%20KM16/2021-02-25/6037f5b9da2cb.pdf"
                        onLoadSuccess={onDocumentLoadSuccess}
                        renderMode="canvas"
                        loading="Cargando PDF"

                    >
                        <Page pageNumber={pageNumber}  scale={2.5} loading="Cargando PDF"/>
                    </Document>
                    <p>Page {pageNumber} of {numPages}</p>

                </Modal.Body>
            </Modal>
        </Menu >
    )
}
export default Ventas;
if (document.getElementById("ventas")) {
    ReactDOM.render(<Ventas />, document.getElementById("ventas"));
}