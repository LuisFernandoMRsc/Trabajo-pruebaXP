using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FerreteriaCatalogo.Models
{
    public class Producto
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required(ErrorMessage = "El nombre del producto es obligatorio")]
        [StringLength(120, ErrorMessage = "El nombre no puede superar los 120 caracteres")]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "La categoría es obligatoria")]
        [StringLength(60)]
        public string Categoria { get; set; } = "General";

        [Required(ErrorMessage = "El precio es obligatorio")]
        [Range(0.01, 1000000.00, ErrorMessage = "El precio debe ser mayor a 0")]
        public decimal Precio { get; set; }

        [Range(0, 100000, ErrorMessage = "El stock no puede ser negativo")]
        public int Stock { get; set; } = 10;

        [StringLength(30)]
        public string UnidadMedida { get; set; } = "Unidad";

        [Required(ErrorMessage = "La descripción es obligatoria")]
        [StringLength(500, ErrorMessage = "La descripción no puede superar los 500 caracteres")]
        public string Descripcion { get; set; } = string.Empty;

        public string? ImagenUrl { get; set; }

        public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;
    }
}
