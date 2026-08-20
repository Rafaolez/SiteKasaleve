import { useEffect, useRef, useState } from "react";

function Camera() {
    const videoRef = useRef(null);
    const [cameraAtiva, setCameraAtiva] = useState(false);
    const [erro, setErro] = useState("");
    const [fotoCapturada, setFotoCapturada] = useState(null);

    const iniciarCamera = async () => {
        try {
            setErro("");

            // facingMode: "environment" tenta abrir a câmera traseira no celular
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }

            setCameraAtiva(true);
        } catch (error) {
            console.error(error);
            setErro("Não foi possível acessar a câmera. Verifique se você está usando HTTPS.");
        }
    };

    const pararCamera = () => {
        const stream = videoRef.current?.srcObject;

        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }

        setCameraAtiva(false);
    };

    const capturarFoto = () => {
        const video = videoRef.current;
        if (!video) return;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataURL = canvas.toDataURL("image/png");
        setFotoCapturada(dataURL);
    };

    useEffect(() => {
        return () => {
            const stream = videoRef.current?.srcObject;
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <div>
            {/* ÚNICA tag video - com muted e playsInline para funcionar no iOS e Android */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted 
                style={{
                    width: "100%",
                    maxWidth: "500px",
                    borderRadius: "10px",
                    display: cameraAtiva ? "block" : "none",
                }}
            />

            <br />

            {!cameraAtiva ? (
                <button onClick={iniciarCamera}>Abrir câmera</button>
            ) : (
                <>
                    <button onClick={pararCamera} style={{ marginRight: "10px" }}>
                        Fechar câmera
                    </button>
                    <button onClick={capturarFoto}>Tirar Foto</button>
                </>
            )}

            {erro && <p style={{ color: "red" }}>{erro}</p>}

            {/* Mostra a foto capturada logo abaixo do vídeo */}
            {fotoCapturada && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Foto Capturada:</h3>
                    <img
                        src={fotoCapturada}
                        alt="Foto capturada"
                        style={{
                            width: "100%",
                            maxWidth: "500px",
                            borderRadius: "10px",
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default Camera;