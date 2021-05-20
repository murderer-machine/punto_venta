import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Image, Modal } from 'react-bootstrap'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
const Inicio = () => {
    const [empresasSeguro, setEmpresasSeguro] = useState([])
    const [productos, setProductos] = useState([])
    const [ramos, setRamos] = useState('')
    const [datos, setDatos] = useState({
        id_empresa_seguro: {},
        id_producto: {},
        nro_poliza: '',
        placa: '',
        importe: '',
        datos_cliente: '',
    })
    const cargarEmpresas = () => {
        fetch('/empresasseguros/mostrar')
            .then(response => response.json())
            .then(data => setEmpresasSeguro(data))
    }
    const cargarProductos = () => {
        fetch(`/productosseguros/mostrar?id=${Object.keys(datos.id_empresa_seguro).length === 0 ? '' : datos.id_empresa_seguro.id}`)
            .then(response => response.json())
            .then(data => setProductos(data))
    }
    const cargarRamos = () => {
        fetch(`/ramos/mostrar?id=${Object.keys(datos.id_producto).length === 0 ? '' : datos.id_producto.id_ramo}`)
            .then(response => response.json())
            .then(data => setRamos(data))
    }
    const handleInputChange = (event) => {
        const { type, checked, name, value } = event.target
        setDatos({
            ...datos,
            [name]:
                {
                    'checkbox': checked,
                    'text': value.trim(),
                    'number': value.trim(),
                }[type]
        })
    }
    useEffect(() => {
        cargarRamos()
    }, [datos.id_producto])
    useEffect(() => {
        cargarProductos()
    }, [datos.id_empresa_seguro])
    useEffect(() => {
        cargarEmpresas()
    }, [])

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <Card className="p-3">
                            <Row>
                                <Col xs={12} lg={12} className="mb-3">
                                    <Autocomplete
                                        options={empresasSeguro}
                                        getOptionLabel={(option) => Object.keys(option).length === 0 ? '' : `${option.nombre.toUpperCase()}`}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                label="Seleccione Empresa"
                                                variant="outlined"
                                                size="small"
                                                autoComplete="off"
                                                fullWidth={true} />
                                        }
                                        noOptionsText="No hay opciones"
                                        value={datos.id_empresa_seguro}
                                        onChange={(event, newValue) => {
                                            if (newValue == null) {
                                                setDatos({
                                                    ...datos,
                                                    id_empresa_seguro: {},
                                                    id_producto: {}
                                                })
                                            } else {
                                                setDatos({
                                                    ...datos,
                                                    id_empresa_seguro: newValue,
                                                    id_producto: {}
                                                })
                                            }
                                        }}
                                    />
                                    {/* {JSON.stringify(datos.id_empresa_seguro)} */}
                                </Col>
                                <Col xs={12} lg={12} className="mb-3">
                                    <Autocomplete
                                        options={productos}
                                        getOptionLabel={(option) => Object.keys(option).length === 0 ? '' : `${option.nombre.toUpperCase()}`}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                label="Seleccione Producto"
                                                variant="outlined"
                                                size="small"
                                                autoComplete="off"
                                                fullWidth={true} />
                                        }
                                        noOptionsText="No hay opciones"
                                        value={datos.id_producto}
                                        onChange={(event, newValue) => {
                                            if (newValue == null) {
                                                setDatos({
                                                    ...datos,
                                                    id_producto: {}
                                                })
                                            } else {
                                                setDatos({
                                                    ...datos,
                                                    id_producto: newValue
                                                })
                                            }
                                        }}
                                    />
                                    {/* {JSON.stringify(datos.id_producto)} */}
                                </Col>
                                <Col xs={12} lg={6} className="mb-3">
                                    <TextField
                                        label="Ramo"
                                        value={ramos.toUpperCase()}
                                        type="text"
                                        fullWidth={true}
                                        variant="outlined"
                                        size="small"
                                        autoComplete="off"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        disabled
                                    />
                                    {/* {JSON.stringify(ramos)} */}
                                </Col>
                                <Col xs={12} lg={6} className="mb-3">
                                    <TextField
                                        label="Nº Póliza"
                                        name="nro_poliza"
                                        value={datos.nro_poliza}
                                        type="text"
                                        fullWidth={true}
                                        variant="outlined"
                                        size="small"
                                        autoComplete="off"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={handleInputChange}
                                    />
                                    {/* {JSON.stringify(datos.nro_poliza)} */}
                                </Col>
                                <Col xs={12} lg={2} className="mb-3">
                                    <TextField
                                        label="Placa"
                                        name="placa"
                                        value={datos.placa}
                                        type="text"
                                        fullWidth={true}
                                        variant="outlined"
                                        size="small"
                                        autoComplete="off"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={handleInputChange}
                                    />
                                    {/* {JSON.stringify(datos.placa)} */}
                                </Col>
                                <Col xs={12} lg={6} className="mb-3">
                                    <TextField
                                        label="Datos del Cliente"
                                        name="datos_cliente"
                                        value={datos.datos_cliente}
                                        type="text"
                                        fullWidth={true}
                                        variant="outlined"
                                        size="small"
                                        autoComplete="off"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={handleInputChange}
                                    />
                                    {/* {JSON.stringify(datos.datos_cliente)} */}
                                </Col>
                                <Col xs={12} lg={4} className="mb-3">
                                    <TextField
                                        label="Importe"
                                        name="importe"
                                        value={datos.importe}
                                        type="number"
                                        fullWidth={true}
                                        variant="outlined"
                                        size="small"
                                        autoComplete="off"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{
                                            maxLength: 13,
                                            step: "0.01"
                                        }}
                                        onChange={handleInputChange}
                                    />
                                    {/* {JSON.stringify(datos.importe)} */}
                                   
                                </Col>
                                <Col xs={12}>
                                {JSON.stringify(datos)}
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default Inicio;