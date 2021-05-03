import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Menu from '../menu/menu_horizontal'
import { Container, Row, Col, Card, Image, Modal } from 'react-bootstrap'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Button from '@material-ui/core/Button'
import { Document, Page, pdfjs } from "react-pdf"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
import AgregarDatosPolizas from './agregar_datos_poliza'

const Ventas = () => {
    const [datos, setDatos] = useState({
        id_subagente: {},
        fecha_inicio: '',
        fecha_final: '',
    })
    const handleInputChange = (event) => {
        const { type, checked, name, value } = event.target
        setDatos({
            ...datos,
            [name]: type === 'checkbox' ? checked : value
        })
    }
    //---------------------------------------------------------
    const [condicionVentas, setCondicionVentas] = useState(true)
    const [ventas, setVentas] = useState([])
    useEffect(() => {
        cargarVentas()
    }, [condicionVentas, datos])
    const cargarVentas = () => {
        fetch(`/subagentes/ventaspagado?id=${Object.keys(datos.id_subagente).length === 0 ? '' : datos.id_subagente.id}&fecha_inicio=${datos.fecha_inicio}&fecha_final=${datos.fecha_final}`)
            .then(response => response.json())
            .then(data => setVentas(data))
    }
    //---------------------------------------------------------
    const [url_pdf, setUrl_pdf] = useState('')
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [zoom, setZoom] = useState(1.0);
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    //---------------------------------------------------------
    const [show, setShow] = useState(false)
    const handleClose = () => {
        setShow(false)
    }
    const handleShow = (ruta) => {
        setZoom(1.0)
        setUrl_pdf(ruta)
        setShow(true)
    }
    //---------------------------------------------------------
    const [subagentes, setSubagentes] = useState([])
    const mostrarSubagentes = async () => {
        await fetch('/subagentes/mostrar')
            .then(response => response.json())
            .then(data => setSubagentes(data))
    }
    useEffect(() => {
        mostrarSubagentes()
    }, [])
    //---------------------------------------------------------
    return (
        <Menu modulo="ventas">
            <Container className="mt-2">
                <Row className="d-flex justify-content-center">
                    <Col xs={12} lg={12}>
                        <Card className="p-3 my-1">
                            <Row>
                                <Col xs={12} lg={4} className="mb-3">
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={subagentes}
                                        getOptionLabel={(option) => Object.keys(option).length === 0 ? '' : `PV. ${option.abreviatura.toUpperCase()}`}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                label="Seleccione punto de venta"
                                                variant="outlined"
                                                size="small"
                                                autoComplete="off"
                                                fullWidth={true} />
                                        }
                                        value={datos.id_subagente}
                                        onChange={(event, newValue) => {
                                            if (newValue == null) {
                                                setDatos({
                                                    ...datos,
                                                    id_subagente: {}
                                                })
                                            } else {
                                                setDatos({
                                                    ...datos,
                                                    id_subagente: newValue
                                                })
                                            }
                                        }}
                                    />
                                </Col>
                                <Col xs={12} lg={4} className="mb-3">
                                    <TextField
                                        label="Fecha inicio"
                                        name="fecha_inicio"
                                        value={datos.fecha_inicio}
                                        onChange={handleInputChange}
                                        type="date"
                                        fullWidth={true}
                                        variant="outlined"
                                        size="small"
                                        autoComplete="off"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}

                                    />
                                </Col>
                                <Col xs={12} lg={4} className="mb-3">
                                    <TextField
                                        label="Fecha final"
                                        name="fecha_final"
                                        value={datos.fecha_final}
                                        onChange={handleInputChange}
                                        type="date"
                                        fullWidth={true}
                                        variant="outlined"
                                        size="small"
                                        autoComplete="off"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Col>
                                <Col xs={12} lg={4} className="mb-3">
                                    <Button variant="contained" type="button" className="btn-principal mt-2" onClick={() => {
                                        setDatos({
                                            id_subagente: {},
                                            fecha_inicio: '',
                                            fecha_final: '',
                                        })
                                    }}>Restablecer filtro</Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    {ventas.length <= 0 ? (<>
                        <Col xs={12} lg={12} className="text-center">
                            <Card className="p-3 my-1">
                                No se encontraron resultados.
                            </Card>
                        </Col>
                    </>) : (<></>)}
                    <Col xs={12} lg={12}>
                        {ventas.map((venta, key_venta) => (
                            <Card className="p-3 my-1" key={key_venta}>
                                <Row className="d-flex align-items-center">
                                    <Col xs={2} lg={1} className="text-center">{ventas.length - (key_venta)}</Col>
                                    <Col xs={10} lg={4}>
                                        <h5 className="m-0 d-inline"><b>PV. {venta.id_subagente.abreviatura.toUpperCase()}</b></h5> - {venta.fecha_creacion}<br />
                                        <p style={{ lineHeight: '19px' }}>
                                            <small>
                                                <b>Fecha Operación : </b>{venta.fecha_operacion} <br />
                                                <b>Nº Operación : </b>{venta.nro_operacion}<br />
                                                <b>Banco : </b>{venta.banco.toUpperCase()}<br />
                                                <b>Fecha Operación : </b>{venta.nombre_cuenta.toUpperCase()}<br />
                                                <b>Observaciones : </b>{venta.observaciones.toUpperCase()}<br />
                                            </small>
                                        </p>
                                    </Col>
                                    <Col xs={6} lg={2} className="text-center">
                                        <a href={venta.ruta} target="_blank" className="mr-1"><Image src="./img/descarga.svg" className="iconos_" /></a>
                                        <a href="#" onClick={() => { handleShow(venta.ruta) }} className="mr-1"><Image src="./img/pdf.svg" className="iconos_" /></a>
                                    </Col>
                                    <Col xs={6} lg={5} className="text-center">
                                        {venta.nombre_archivo_imagen.map((imagen, key_imagen) => (
                                            <Zoom key={key_imagen}>
                                                <Image src={`./${venta.ruta_voucher}${imagen}`} className="inicio_img_voucher mx-1 my-1" />
                                            </Zoom>
                                        ))}
                                    </Col>
                                </Row>
                            </Card>
                        ))}
                    </Col>
                </Row>
            </Container>
            <AgregarDatosPolizas />
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Body>
                    <button onClick={() => { setZoom(zoom + 0.5) }}> + </button>
                    <button onClick={() => { zoom <= 0.5 ? {} : setZoom(zoom - 0.5) }}> - </button>
                    <Document
                        file={url_pdf}
                        onLoadSuccess={onDocumentLoadSuccess}
                        renderMode="canvas"
                        loading="Cargando PDF"
                    >
                        <Page pageNumber={pageNumber} scale={zoom} loading="Cargando PDF" />
                    </Document>
                    <p>Página {pageNumber} de {numPages}</p>
                </Modal.Body>
            </Modal>
        </Menu >
    )
}
export default Ventas;
if (document.getElementById("ventas")) {
    ReactDOM.render(<Ventas />, document.getElementById("ventas"));
}