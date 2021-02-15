import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Menu from '../menu/menu_horizontal'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone'
import './inicio.scss'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Autocomplete from '@material-ui/lab/Autocomplete'
const Inicio = () => {
    const [subagentes, setSubagentes] = useState([])
    const [ventas, setVentas] = useState([])
    const [condicionVentas, setCondicionVentas] = useState(true)
    const [datos, setDatos] = useState({
        id_subagente: {},
    })
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: '.pdf',
        multiple: false,
    })
    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            <small>{file.path} - {file.size} bytes</small><br />
        </li>
    ))
    const mostrarSubagentes = async () => {
        await fetch('/subagentes/mostrar')
            .then(response => response.json())
            .then(data => setSubagentes(data))
    }
    const subirCertificado = () => {
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
                alert(response)
                console.log(response)
                setCondicionVentas(!condicionVentas)
            });
    }
    const cargarVentas = () => {
        fetch('/subagentes/ventas')
            .then(response => response.json())
            .then(data => setVentas(data));
    }
    useEffect(() => {
        mostrarSubagentes()
    }, [])
    useEffect(() => {
        cargarVentas()
    }, [condicionVentas])
    return (
        <Menu modulo="inicio">
            <Container className="mt-2" fluid>
                <Row>
                    <Col xs={12} lg={5}>
                        <Card className="p-3">
                            <Row>
                                <Col xs={12}>
                                    <div {...getRootProps({ className: 'dropzone m-0 p-3 mb-2' })} >
                                        <input {...getInputProps()} />
                                            Seleccione o arrastre
                                        </div>
                                    <h6>Archivos seleccionados : </h6>
                                    <ol>{files}</ol>
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
                                    <Button variant="contained" type="button" className="btn-principal mt-2" size="small" onClick={subirCertificado}>Ingresar</Button>
                                </Col>
                                {JSON.stringify(datos)}
                            </Row>
                        </Card>
                    </Col>
                    <Col xs={12} lg={7}>
                        {JSON.stringify(ventas)}
                    </Col>
                </Row>
            </Container>
        </Menu>
    )
}
export default Inicio;
if (document.getElementById("inicio")) {
    ReactDOM.render(<Inicio />, document.getElementById("inicio"));
}