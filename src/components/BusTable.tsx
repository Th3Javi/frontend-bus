import React, { useState, useEffect } from "react";

interface Bus {
    id: number;
    numeroBus: number;
    placa: string;
    fechaCreacion: string;
    caracteristicas: string;
    estado: string;
    marca: {
        id: number;
        nombre: string;
    };
}

const BusTable: React.FC = () => {
    const [buses, setBuses] = useState<Bus[]>([]);
    const [searchId, setSearchId] = useState<number | null>(null);
    const [searchResult, setSearchResult] = useState<Bus | null>(null);
    const [isViewingSingleBus, setIsViewingSingleBus] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/bus?page=${currentPage}&size=5`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Error al obtener los datos");
                }

                const data = await response.json();
                setBuses(data.content);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchBuses();
    }, [currentPage]);

    const fetchBusById = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/bus/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Bus no encontrado");
            }

            const data: Bus = await response.json();
            setSearchResult(data);
            setIsViewingSingleBus(true);
        } catch (error) {
            console.error("Error:", error);
            alert("Bus no encontrado. Por favor, intenta con otro ID.");
            setSearchResult(null);
        } finally {
            setSearchId(null);
        }
    };

    const handleSearch = () => {
        if (searchId !== null) {
            fetchBusById(searchId);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div>
            <h1>Administración de Buses</h1> { }

            {isViewingSingleBus ? (
                <div>
                    <h2>Bus Seleccionado</h2>
                    {searchResult && (
                        <div>
                            <table border={1} style={{ width: "100%", textAlign: "left" }}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Número de Bus</th>
                                        <th>Placa</th>
                                        <th>Fecha de Creación</th>
                                        <th>Características</th>
                                        <th>Estado</th>
                                        <th>Marca</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{searchResult.id}</td>
                                        <td>{searchResult.numeroBus}</td>
                                        <td>{searchResult.placa}</td>
                                        <td>{searchResult.fechaCreacion}</td>
                                        <td>{searchResult.caracteristicas}</td>
                                        <td>{searchResult.estado}</td>
                                        <td>{searchResult.marca.nombre}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            setIsViewingSingleBus(false);
                            setSearchResult(null);
                        }}
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Volver
                    </button>
                </div>
            ) : (
                <div>
                    <div>
                        <input
                            type="number"
                            placeholder="Buscar por ID"
                            value={searchId ?? ""}
                            onChange={(e) => setSearchId(Number(e.target.value))}
                        />
                        <button onClick={handleSearch}>Buscar</button>
                    </div>

                    <table border={1} style={{ width: "100%", textAlign: "left", marginTop: "20px" }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Número de Bus</th>
                                <th>Placa</th>
                                <th>Fecha de Creación</th>
                                <th>Características</th>
                                <th>Estado</th>
                                <th>Marca</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buses.map((bus) => (
                                <tr key={bus.id}>
                                    <td>{bus.id}</td>
                                    <td>{bus.numeroBus}</td>
                                    <td>{bus.placa}</td>
                                    <td>{bus.fechaCreacion}</td>
                                    <td>{bus.caracteristicas}</td>
                                    <td>{bus.estado}</td>
                                    <td>{bus.marca.nombre}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 0}
                            style={{ marginRight: "10px", padding: "5px 10px" }}
                        >
                            Anterior
                        </button>
                        <span>
                            Página {currentPage + 1} de {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages - 1}
                            style={{ marginLeft: "10px", padding: "5px 10px" }}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusTable;