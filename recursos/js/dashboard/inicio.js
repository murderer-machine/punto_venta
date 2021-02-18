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
    const [datosVoucher, setDatosVoucher] = useState({
        id_subagente_venta: '',
        fecha_operacion: '',
        nro_operacion: '',
        banco: '',
        nombre_archivo_imagen: '',
        observaciones: '',
        
    })
    const [show, setShow] = useState(false)
    const [mensajeCertificado, setMensajeCertificado] = useState(false)
    const [spinner_certificado, SetSpinner_certificado] = useState(false)
    const [mensajesValidacionCargaCertificado, setMensajesValidacionCargaCertificado] = useState({
        success: false,
        error: false,
    })
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
    const LimpiarValidacionCargaCertificado = () => {
        setMensajesValidacionCargaCertificado({
            success: false,
            error: false,
        })
    }
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
                    if (response == 0) {
                        setMensajesValidacionCargaCertificado({
                            success: true,
                            error: false,
                        })
                        SetSpinner_certificado(false)
                        setCondicionVentas(!condicionVentas)
                        setAcceptedFiles([])
                        setDatos({ ...datos, id_subagente: {} })
                    }
                    if (response != 0) {
                        setMensajesValidacionCargaCertificado({
                            success: false,
                            error: true,
                        })
                        LimpiarValidacionCargaCertificado()
                        SetSpinner_certificado(false)
                    }
                });
        }
    }
    const subirVoucher = () => {
        var formData = new FormData()
        for (const file of acceptedFilesVoucher) {
            formData.append('documento[]', file, file.name)
        }
        formData.append('id_subagente_venta', datosVoucher.id_subagente_venta)
        formData.append('fecha_operacion', datosVoucher.fecha_operacion)
        formData.append('nro_operacion', datosVoucher.nro_operacion)
        formData.append('banco', datosVoucher.banco)
        formData.append('nombre_cuenta', datosVoucher.nombre_cuenta)
        formData.append('nombre_archivo_imagen', datosVoucher.nombre_archivo_imagen)
        formData.append('observaciones', datosVoucher.observaciones)
        
        var url = `/subagentes/subirvoucher`
        fetch(url, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                alert(response)
            });
    }

    const cargarVentas = () => {
        fetch('/subagentes/ventas')
            .then(response => response.json())
            .then(data => setVentas(data))
    }

    const handleClose = () => {
        setShow(false)
        setDatosVoucher({
            id_subagente_venta: '',
            fecha_operacion: '',
            nro_operacion: '',
            banco: '',
            nombre_cuenta: '',
            nombre_archivo: '',
            observaciones: '',
            ruta_voucher: '',
        })
    }
    const handleShow = (id, nombre_archivo_imagen) => {
        setShow(true)
        setDatosVoucher({
            ...datosVoucher,
            id_subagente_venta: id,
            nombre_archivo_imagen: nombre_archivo_imagen,
        })
    }
    const handleInputChange = (event) => {
        const { type, checked, name, value } = event.target
        setDatosVoucher({
            ...datosVoucher,
            [name]: type === 'checkbox' ? checked : value
        })
    }
    return (
        <Menu modulo="inicio">
            <Container className="mt-2">
                <Row className="d-flex justify-content-center">
                    <Col xs={12}>
                        {JSON.stringify(datosVoucher)}
                    </Col>
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
                                    <Dropzone onDrop={acceptedFiles => {
                                        setAcceptedFiles(acceptedFiles)
                                        LimpiarValidacionCargaCertificado()
                                    }} accept=".pdf" multiple={false} >
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
                        {mensajesValidacionCargaCertificado.success ? (<>
                            <Card className="p-3 my-1">
                                <Row>
                                    <Col xs={12}>
                                        <Alert severity="success">
                                            Se subio y agrego correctamente.
                                        </Alert>
                                    </Col>
                                </Row>
                            </Card>
                        </>) : (<></>)}
                        {mensajesValidacionCargaCertificado.error ? (<>
                            <Card className="p-3 my-1">
                                <Row>
                                    <Col xs={12}>
                                        <Alert severity="error">
                                            <b>Error</b> informar al área de sistemas.
                                        </Alert>
                                    </Col>
                                </Row>
                            </Card>
                        </>) : (<></>)}
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
                                        <Button variant="contained" type="button" className="btn-principal" size="small" onClick={() => { handleShow(venta.id, venta.ruta_voucher) }}>Voucher</Button>
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
                                name="fecha_operacion"
                                value={datosVoucher.fecha_operacion}
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
                        <Col xs={12} className="mb-3">
                            <TextField
                                label="Nro operación"
                                name="nro_operacion"
                                value={datosVoucher.nro_operacion}
                                onChange={handleInputChange}
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
                                name="banco"
                                value={datosVoucher.banco}
                                onChange={handleInputChange}
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
                                name="nombre_cuenta"
                                value={datosVoucher.nombre_cuenta}
                                onChange={handleInputChange}
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
                                name="observaciones"
                                value={datosVoucher.observaciones}
                                onChange={handleInputChange}
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
                    <Col xs={12}>
                        {JSON.stringify(datosVoucher)}
                    </Col>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="contained" type="button" className="btn-principal mr-2" size="small" onClick={subirVoucher}>Agregar</Button>
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