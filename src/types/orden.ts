export default interface Orden {
  id: number,
  inicio: Date,
  cierre: Date,
  importe: number,
  clienteId: number,
  mesaId: number,
  usuarioId: number,
  preparada: boolean,
}