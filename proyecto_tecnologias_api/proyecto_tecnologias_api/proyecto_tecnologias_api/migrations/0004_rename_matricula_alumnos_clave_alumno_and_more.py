# Generated by Django 5.0.2 on 2024-11-05 05:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('proyecto_tecnologias_api', '0003_alumnos_maestros'),
    ]

    operations = [
        migrations.RenameField(
            model_name='alumnos',
            old_name='matricula',
            new_name='clave_alumno',
        ),
        migrations.RenameField(
            model_name='maestros',
            old_name='area_investigacion',
            new_name='area',
        ),
        migrations.RenameField(
            model_name='maestros',
            old_name='id_trabajador',
            new_name='clave_maestro',
        ),
    ]
