import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Menu from '../menu/menu_horizontal'
import { Form, Container, Row, Col, Card } from 'react-bootstrap'
import ImageUploading from 'react-images-uploading'
import Button from 'react-bootstrap/Button'
import Alert from '@material-ui/lab/Alert'
import { TrashFill, PencilFill } from 'react-bootstrap-icons'
const Inicio = () => {

    const [images, setImages] = useState([])
    const maxNumber = 4
    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList)
    }

    return (
        <Menu modulo="inicio">
            <Container className="mt-2">
                <Row>
                    <Col xs={12} lg={5}>
                        <Row>
                            <Col xs={12}>
                                <Card className="p-3">
                                    <ImageUploading
                                        multiple
                                        value={images}
                                        onChange={onChange}
                                        maxNumber={maxNumber}
                                        dataURLKey="data_url"
                                    >
                                        {({
                                            imageList,
                                            onImageUpload,
                                            onImageRemoveAll,
                                            onImageUpdate,
                                            onImageRemove,
                                            isDragging,
                                            dragProps,
                                            errors,
                                        }) => (
                                            <>
                                                {
                                                    errors &&
                                                    <Alert severity="error">
                                                        {errors.maxNumber && <span>El número de imágenes seleccionadas supera el número máximo ({maxNumber})</span>}
                                                        {errors.acceptType && <span>El tipo de archivo seleccionado no está permitido</span>}
                                                        {errors.maxFileSize && <span>El tamaño del archivo seleccionado excede </span>}
                                                        {errors.resolution && <span>El archivo seleccionado no coincide con la resolución deseada</span>}
                                                    </Alert>
                                                }
                                                <div className={`upload_drag_click ${isDragging ? 'drag' : ''}`} {...dragProps} onClick={onImageUpload}>
                                                    Click o Arrastre aquí
                                                </div>            &nbsp;
                                                <Button variant="danger" onClick={onImageRemoveAll} size="sm">Eliminar imágenes</Button>
                                                <Row className="mt-2">
                                                    {imageList.map((image, index) => (
                                                        <Col key={index} xs={6}>
                                                            <Row>
                                                                <Col xs={12} className="text-center">
                                                                    <img src={image['data_url']} alt="" style={{ height: 50 }} />
                                                                </Col>
                                                                <Col xs={12} className="text-center">
                                                                    <Button variant="info" onClick={() => onImageUpdate(index)} size="sm" className="m-1"><PencilFill /></Button>
                                                                    <Button variant="danger" onClick={() => onImageRemove(index)} size="sm" className="m-1"><TrashFill /></Button>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </>
                                        )}
                                    </ImageUploading>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} lg={7}>

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