import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Menu from '../menu/menu_horizontal'
import { Container, Row, Col, Card, Image, Modal } from 'react-bootstrap'
// import { useDropzone } from 'react-dropzone'
import Dropzone from 'react-dropzone'
import './inicio.scss'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

import Autocomplete from '@material-ui/lab/Autocomplete'
import { Alert, AlertTitle } from '@material-ui/lab'
const Inicio = () => {
    const [subagentes, setSubagentes] = useState([])
    const [acceptedFiles, setAcceptedFiles] = useState([])
    const [acceptedFilesVoucher, setAcceptedFilesVoucher] = useState([])
    const [ventas, setVentas] = useState([])
    const [condicionVentas, setCondicionVentas] = useState(true)
    const [datos, setDatos] = useState({
        id_subagente: {},
    })
    const [show, setShow] = useState(false)
    const [mensajeCertificado, setMensajeCertificado] = useState(false)
    const [spinner_certificado, SetSpinner_certificado] = useState(false)
    //Renders
    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            <small>{file.path} - {file.size} bytes</small><br />
        </li>
    ))
    const filesVoucher = acceptedFilesVoucher.map(file => (
        <li key={file.path}>
            <small>{file.path} - {file.size} bytes</small><br />
        </li>
    ))
    //UseEffect
    useEffect(() => {
        mostrarSubagentes()
    }, [])
    useEffect(() => {
        cargarVentas()
    }, [condicionVentas])
    //Funciones
    const mostrarSubagentes = async () => {
        await fetch('/subagentes/mostrar')
            .then(response => response.json())
            .then(data => setSubagentes(data))
    }
    const subirCertificado = () => {
        if (!acceptedFiles.length || Object.keys(datos.id_subagente).length === 0) {
            setMensajeCertificado(true)
        } else {
            setMensajeCertificado(false)
            SetSpinner_certificado(true)
            var formData = new FormData()
            for (const file of acceptedFiles) {
                formData.append('documento[]', file, file.name)
            }
            formData.append('id_subagente', datos.id_subagente.id)
            formData.append('nombre_subagente', datos.id_subagente.abreviatura)
            var url = `/subagentes/subir`
            fetch(url, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .catch(error => console.error('Error:', error))
                .then(response => {
                    SetSpinner_certificado(false)
                    setCondicionVentas(!condicionVentas)
                    setAcceptedFiles([])
                    setDatos({ ...datos, id_subagente: {} })
                });
        }

    }
    const cargarVentas = () => {
        fetch('/subagentes/ventas')
            .then(response => response.json())
            .then(data => setVentas(data));
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <Menu modulo="inicio">
            <Container className="mt-2">
                <Row className="d-flex justify-content-center">
                    <Col xs={12} lg={6}>
                        <Card className="p-3">
                            <Row>
                                {mensajeCertificado ? (<>
                                    <Col xs={12} className="mb-2">
                                        <Alert severity="error">
                                            <AlertTitle>Falta completar campos</AlertTitle>
                                            <ul>
                                                <li>Verifique si ha seleccionado un certificado.</li>
                                                <li>verifique si ha seleccionado un punto de venta.</li>
                                            </ul>
                                        </Alert>
                                    </Col>
                                </>) : (<></>)}

                                <Col xs={12}>
                                    <Dropzone onDrop={acceptedFiles => setAcceptedFiles(acceptedFiles)} accept=".pdf" multiple={false}  >
                                        {({ getRootProps, getInputProps }) => (
                                            <>
                                                <div {...getRootProps({ className: 'dropzone m-0 p-3 mb-2' })} >
                                                    <input {...getInputProps()} />
                                                    Seleccione o arrastre
                                                </div>
                                                <h6>Archivo seleccionado : </h6>
                                                <ol>{files}</ol>
                                            </>
                                        )}
                                    </Dropzone>
                                </Col>
                                <Col xs={12}>
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
                                <Col xs={12}>
                                    <Button variant="contained" type="button" className="btn-principal mt-2" onClick={subirCertificado} disabled={spinner_certificado}>{spinner_certificado ? (<CircularProgress size={15} className="spinner_blanco mr-2" />) : (<></>)}Ingresar</Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col xs={12} lg={12}>
                        {ventas.map((venta, key_venta) => (
                            <Card className="p-3 my-1" key={key_venta}>
                                <Row className="d-flex align-items-center text-center">
                                    <Col xs={2}>{venta.id}</Col>
                                    <Col xs={5}>
                                        <h5 className="m-0"><b>PV. {venta.id_subagente.abreviatura.toUpperCase()}</b></h5>
                                        {venta.fecha_creacion}<br />
                                    </Col>
                                    <Col xs={2}><a href={venta.ruta} target="_blank"><Image src="./img/pdf.svg" className="inicio_img_pdf" /></a></Col>
                                    <Col xs={3}>{venta.pagado == 0 ? (<>
                                        <Button variant="contained" type="button" className="btn-principal" size="small" onClick={handleShow}>Pagar</Button>
                                    </>) : (<></>)}</Col>
                                </Row>
                            </Card>
                        ))}
                    </Col>
                </Row>
            </Container>
            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Body>
                    <Row>
                        <Col xs={12} className="mb-3">
                            <TextField
                                label="Fecha operación"
                                name="password"
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
                        <Col xs={12} className="mb-3">
                            <TextField
                                label="Nro operación"
                                name="password"
                                type="text"
                                fullWidth={true}
                                variant="outlined"
                                size="small"
                                autoComplete="off"
                            />
                        </Col>
                        <Col xs={12} className="mb-3">
                            <TextField
                                label="Banco"
                                name="password"
                                type="text"
                                fullWidth={true}
                                variant="outlined"
                                size="small"
                                autoComplete="off"
                            />
                        </Col>
                        <Col xs={12} className="mb-3">
                            <TextField
                                label="Nombre Cuenta"
                                name="password"
                                type="text"
                                fullWidth={true}
                                variant="outlined"
                                size="small"
                                autoComplete="off"
                            />
                        </Col>
                        <Col xs={12} className="mb-3">
                            <TextField
                                label="Observaciones"
                                name="password"
                                type="text"
                                fullWidth={true}
                                variant="outlined"
                                size="small"
                                autoComplete="off"
                                multiline
                                rowsMax={4}
                            />
                        </Col>
                        <Col>
                            <Dropzone onDrop={acceptedFiles => setAcceptedFilesVoucher(acceptedFiles)} accept="image/*" multiple={false}  >
                                {({ getRootProps, getInputProps }) => (
                                    <>
                                        <div {...getRootProps({ className: 'dropzone m-0 p-3 mb-2' })} >
                                            <input {...getInputProps()} />
                                                    Seleccione o arrastre
                                                </div>
                                        <h6>Archivo seleccionado : </h6>
                                        <ol>{filesVoucher}</ol>
                                    </>
                                )}
                            </Dropzone>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="contained" type="button" className="btn-principal mr-2" size="small">Agregar</Button>
                    <Button variant="contained" type="button" className="btn-principal" size="small" onClick={handleClose}>Cancelar</Button>
                </Modal.Footer>
            </Modal>
        </Menu>
    )
}
export default Inicio;
if (document.getElementById("inicio")) {
    ReactDOM.render(<Inicio />, document.getElementById("inicio"));
}