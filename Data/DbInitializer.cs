using FerreteriaCatalogo.Models;

namespace FerreteriaCatalogo.Data
{
    public static class DbInitializer
    {
        public static void Seed(AppDbContext context)
        {
            if (context.Productos.Any())
            {
                return; // Ya contiene datos
            }

            var productos = new List<Producto>
            {
                new Producto
                {
                    Nombre = "Cemento Portland Tipo I Extra Fuerte (50 kg)",
                    Categoria = "Construcción",
                    Precio = 11.50m,
                    Stock = 120,
                    UnidadMedida = "Bolsa",
                    Descripcion = "Cemento gris de alta resistencia inicial y final para columnas, vigas, losas y revoques de máxima durabilidad.",
                    ImagenUrl = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
                    FechaRegistro = DateTime.UtcNow.AddDays(-10)
                },
                new Producto
                {
                    Nombre = "Pala Corazón Reforzada Mango de Madera 70cm",
                    Categoria = "Herramientas",
                    Precio = 18.75m,
                    Stock = 35,
                    UnidadMedida = "Unidad",
                    Descripcion = "Pala de punta en corazón con hoja de acero forjado al carbono templado, cabo de madera dura pulida y empuñadura ergonómica.",
                    ImagenUrl = "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80",
                    FechaRegistro = DateTime.UtcNow.AddDays(-8)
                },
                new Producto
                {
                    Nombre = "Pala Carbonera Cuadrada de Chapa Estampada",
                    Categoria = "Herramientas",
                    Precio = 19.90m,
                    Stock = 24,
                    UnidadMedida = "Unidad",
                    Descripcion = "Ideal para palear arena, ripio, granza y mezclas de concreto. Resistencia extrema al impacto y desgaste.",
                    ImagenUrl = "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&auto=format&fit=crop&q=80",
                    FechaRegistro = DateTime.UtcNow.AddDays(-7)
                },
                new Producto
                {
                    Nombre = "Martillo Galponero Uña Curva 16oz Mango Fibra",
                    Categoria = "Herramientas",
                    Precio = 12.40m,
                    Stock = 50,
                    UnidadMedida = "Unidad",
                    Descripcion = "Cabeza pulida de acero forjado con uña saca clavos, mango ergonómico de fibra de vidrio con grip antideslizante.",
                    ImagenUrl = "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&auto=format&fit=crop&q=80",
                    FechaRegistro = DateTime.UtcNow.AddDays(-6)
                },
                new Producto
                {
                    Nombre = "Arena Gruesa Lavada Zarandeada (Bolsón 1m³)",
                    Categoria = "Construcción",
                    Precio = 38.00m,
                    Stock = 40,
                    UnidadMedida = "Bolsón",
                    Descripcion = "Arena limpia libre de impurezas orgánicas y arcillas. Granulometría perfecta para hormigón y mampostería.",
                    ImagenUrl = "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80",
                    FechaRegistro = DateTime.UtcNow.AddDays(-5)
                },
                new Producto
                {
                    Nombre = "Pintura Látex Interior y Exterior Lavable 20L",
                    Categoria = "Pintura",
                    Precio = 49.50m,
                    Stock = 18,
                    UnidadMedida = "Balde",
                    Descripcion = "Pintura al agua de alto poder cubritivo, anti-hongos, acabado mate sedoso y secado rápido para muros y frentes.",
                    ImagenUrl = "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80",
                    FechaRegistro = DateTime.UtcNow.AddDays(-4)
                },
                new Producto
                {
                    Nombre = "Carretilla Chapa Reforzada 90 Litros Rueda Neumática",
                    Categoria = "Construcción",
                    Precio = 62.00m,
                    Stock = 15,
                    UnidadMedida = "Unidad",
                    Descripcion = "Tolva de chapa calibre 20 reforzada con borde perimetral redondo, rodamientos de acero y eje de 20mm.",
                    ImagenUrl = "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80",
                    FechaRegistro = DateTime.UtcNow.AddDays(-3)
                },
                new Producto
                {
                    Nombre = "Varilla de Acero Corrugado ADN 420 12mm x 12m",
                    Categoria = "Construcción",
                    Precio = 14.80m,
                    Stock = 200,
                    UnidadMedida = "Barra",
                    Descripcion = "Barras de acero de alta ductilidad soldable para estructuras sismorresistentes según normas IRAM-IAS.",
                    ImagenUrl = "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80",
                    FechaRegistro = DateTime.UtcNow.AddDays(-2)
                },
                new Producto
                {
                    Nombre = "Amoladora Angular 4 1/2 Pulgadas 850W",
                    Categoria = "Herramientas Eléctricas",
                    Precio = 54.00m,
                    Stock = 22,
                    UnidadMedida = "Unidad",
                    Descripcion = "Potente motor de 850W a 11,000 RPM con guarda de seguridad ajustable y mango lateral auxiliar de 2 posiciones.",
                    ImagenUrl = "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&auto=format&fit=crop&q=80",
                    FechaRegistro = DateTime.UtcNow.AddDays(-1)
                }
            };

            context.Productos.AddRange(productos);
            context.SaveChanges();
        }
    }
}
