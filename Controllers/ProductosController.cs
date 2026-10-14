using FerreteriaCatalogo.Data;
using FerreteriaCatalogo.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FerreteriaCatalogo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ProductosController> _logger;

        public ProductosController(AppDbContext context, ILogger<ProductosController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/productos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos(
            [FromQuery] string? q = null,
            [FromQuery] string? categoria = null,
            [FromQuery] string? ordenar = null)
        {
            var query = _context.Productos.AsQueryable();

            if (!string.IsNullOrWhiteSpace(q))
            {
                var busqueda = q.Trim().ToLower();
                query = query.Where(p => 
                    p.Nombre.ToLower().Contains(busqueda) || 
                    p.Descripcion.ToLower().Contains(busqueda) ||
                    p.Categoria.ToLower().Contains(busqueda));
            }

            if (!string.IsNullOrWhiteSpace(categoria) && categoria != "Todas")
            {
                query = query.Where(p => p.Categoria.ToLower() == categoria.ToLower());
            }

            query = ordenar switch
            {
                "precio-asc" => query.OrderBy(p => p.Precio),
                "precio-desc" => query.OrderByDescending(p => p.Precio),
                "nombre" => query.OrderBy(p => p.Nombre),
                _ => query.OrderByDescending(p => p.Id)
            };

            return await query.ToListAsync();
        }

        // GET: api/productos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);

            if (producto == null)
            {
                return NotFound(new { mensaje = $"No se encontró el producto con Id {id}" });
            }

            return producto;
        }

        // GET: api/productos/categorias
        [HttpGet("categorias")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategorias()
        {
            var categorias = await _context.Productos
                .Select(p => p.Categoria)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            return Ok(categorias);
        }

        // GET: api/productos/resumen
        [HttpGet("resumen")]
        public async Task<ActionResult<object>> GetResumen()
        {
            var totalProductos = await _context.Productos.CountAsync();
            var totalCategorias = await _context.Productos.Select(p => p.Categoria).Distinct().CountAsync();
            var valorTotal = await _context.Productos.SumAsync(p => p.Precio * (decimal)p.Stock);
            var productosBajoStock = await _context.Productos.CountAsync(p => p.Stock <= 5);

            return Ok(new
            {
                totalProductos,
                totalCategorias,
                valorTotal,
                productosBajoStock
            });
        }

        // POST: api/productos
        [HttpPost]
        public async Task<ActionResult<Producto>> CreateProducto([FromBody] Producto producto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Normalización básica
            producto.Nombre = producto.Nombre.Trim();
            producto.Categoria = string.IsNullOrWhiteSpace(producto.Categoria) ? "General" : producto.Categoria.Trim();
            producto.Descripcion = producto.Descripcion.Trim();
            producto.FechaRegistro = DateTime.UtcNow;

            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProducto), new { id = producto.Id }, producto);
        }

        // PUT: api/productos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProducto(int id, [FromBody] Producto producto)
        {
            if (id != producto.Id)
            {
                return BadRequest(new { mensaje = "El ID de la ruta no coincide con el del producto" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existe = await _context.Productos.AnyAsync(p => p.Id == id);
            if (!existe)
            {
                return NotFound(new { mensaje = $"No se encontró el producto con Id {id}" });
            }

            _context.Entry(producto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }

        // DELETE: api/productos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
            {
                return NotFound(new { mensaje = $"No se encontró el producto con Id {id}" });
            }

            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = $"Producto '{producto.Nombre}' eliminado exitosamente" });
        }
    }
}
