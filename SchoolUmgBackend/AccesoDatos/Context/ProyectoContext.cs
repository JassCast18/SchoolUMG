using System;
using System.Collections.Generic;
using AccesoDatos.Models;
using Microsoft.EntityFrameworkCore;

namespace AccesoDatos.Context;

public partial class ProyectoContext : DbContext
{
    public ProyectoContext()
    {
    }

    public ProyectoContext(DbContextOptions<ProyectoContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Alumno> Alumnos { get; set; }

    public virtual DbSet<Producto> Productos { get; set; }

    public virtual DbSet<Asignatura> Asignaturas { get; set; }

    public virtual DbSet<Calificacion> Calificacions { get; set; }

    public virtual DbSet<Matricula> Matriculas { get; set; }

    public virtual DbSet<Profesor> Profesors { get; set; }

    public virtual DbSet<AlumnosPorAsignatura> AlumnoPorAsignaturas { get; set; }

    public virtual DbSet<DistribucionCalificaciones> DistribucionCalificaciones { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
           => optionsBuilder.UseSqlServer("Server=DESKTOP-PKLCDG4\\SQLEXPRESS01;Database=proyecto;User Id=jcastellanos;Password=toor;TrustServerCertificate=True;MultipleActiveResultSets=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Alumno>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__alumno__3213E83F51148AF5");

            entity.ToTable("alumno");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Direccion)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("direccion");
            entity.Property(e => e.Dni)
                .HasMaxLength(8)
                .IsUnicode(false)
                .HasColumnName("dni");
            entity.Property(e => e.Edad).HasColumnName("edad");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.Nombre)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("nombre");
        });

        modelBuilder.Entity<Producto>(entity =>
        {
            entity.HasKey(e => e.id_producto).HasName("PK__producto__3213E83F51148AF5");

            entity.ToTable("productos");

            entity.Property(e => e.id_producto).HasColumnName("id_producto");
            entity.Property(e => e.descripcion)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("descripcion");
            entity.Property(e => e.stock).HasColumnName("stock");
            entity.Property(e => e.precio_venta).HasColumnName("precio_venta");
            entity.Property(e => e.id_categoria)
                .HasColumnName("id_categoria");
            entity.Property(e => e.fecha_ingreso)
                .HasColumnName("fecha_ingreso");
            entity.Property(e => e.fecha_caducidad)
                .HasColumnName("fecha_caducidad");
        });

        modelBuilder.Entity<Asignatura>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__asignatu__3213E83FC9CC1A18");

            entity.ToTable("asignatura");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Creditos).HasColumnName("creditos");
            entity.Property(e => e.Nombre)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.Profesor)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("profesor");

            entity.HasOne(d => d.ProfesorNavigation).WithMany(p => p.Asignaturas)
                .HasForeignKey(d => d.Profesor)
                .HasConstraintName("FK__asignatur__profe__4E88ABD4");
        });

        modelBuilder.Entity<Calificacion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__califica__3213E83F08732F98");

            entity.ToTable("calificacion");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("descripcion");
            entity.Property(e => e.MatriculaId).HasColumnName("matriculaId");
            entity.Property(e => e.Nota).HasColumnName("nota");
            entity.Property(e => e.Porcentaje).HasColumnName("porcentaje");

            entity.HasOne(d => d.Matricula).WithMany(p => p.Calificacions)
                .HasForeignKey(d => d.MatriculaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__calificac__matri__5535A963");
        });

        modelBuilder.Entity<Matricula>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__matricul__3213E83F633CEC3F");

            entity.ToTable("matricula");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AlumnoId).HasColumnName("alumnoId");
            entity.Property(e => e.AsignaturaId).HasColumnName("asignaturaId");

            entity.HasOne(d => d.Alumno).WithMany(p => p.Matriculas)
                .HasForeignKey(d => d.AlumnoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__matricula__alumn__5165187F");

            entity.HasOne(d => d.Asignatura).WithMany(p => p.Matriculas)
                .HasForeignKey(d => d.AsignaturaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__matricula__asign__52593CB8");
        });

        modelBuilder.Entity<Profesor>(entity =>
        {
            entity.HasKey(e => e.Usuario).HasName("PK__profesor__9AFF8FC771C5CAC1");

            entity.ToTable("profesor");

            entity.Property(e => e.Usuario)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("usuario");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.Nombre)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.Pass)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("pass");
        });

        modelBuilder.Entity<AlumnosPorAsignatura>(entity =>
        {
            entity.HasNoKey();
            entity.ToView("vw_AlumnosPorAsignatura");
            entity.Property(e => e.IdAsignatura).HasColumnName("idAsignatura");
            entity.Property(e => e.NombreAsignatura).HasColumnName("NombreAsignatura");
            entity.Property(e => e.TotalAlumnos).HasColumnName("TotalAlumnos");

        });


        modelBuilder.Entity<DistribucionCalificaciones>(entity =>
        {
            entity.HasNoKey();
            entity.ToView("vw_DistribucionCalificaciones");
            entity.Property(e => e.Matriculaid).HasColumnName("MatriculaId");
            entity.Property(e => e.Alumnoid).HasColumnName("AlumnoId");
            entity.Property(e => e.NombreAlumno).HasColumnName("NombreAlumno");
            entity.Property(e => e.NotaFinal).HasColumnName("NotaFinal");

        });
        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
