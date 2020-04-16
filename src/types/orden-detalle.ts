export default interface OrdenDetalle {
  id: number;
  ordenId: number;
  productoId: number;
  anotaciones: string;
  cantidad: number;
  subtotal: number;
}
