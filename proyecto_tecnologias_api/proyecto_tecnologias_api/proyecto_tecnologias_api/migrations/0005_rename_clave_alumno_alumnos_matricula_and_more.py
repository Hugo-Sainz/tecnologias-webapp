# Generated by Django 5.0.2 on 2024-11-05 05:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('proyecto_tecnologias_api', '0004_rename_matricula_alumnos_clave_alumno_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='alumnos',
            old_name='clave_alumno',
            new_name='matricula',
        ),
        migrations.RenameField(
            model_name='maestros',
            old_name='area',
            new_name='area_investigacion',
        ),
        migrations.RenameField(
            model_name='maestros',
            old_name='clave_maestro',
            new_name='id_trabajador',
        ),
    ]
