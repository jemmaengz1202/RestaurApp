export default interface Producto {
  id: number,
  nombre: string,
  precio: number,
  descripcion: string,
  imagenUrl?: string,
  categoriaId: number,
}