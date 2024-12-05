from django.shortcuts import render
from django.db.models import *
from django.db import transaction
from proyecto_tecnologias_api.serializers import *
from proyecto_tecnologias_api.models import *
from rest_framework.authentication import BasicAuthentication, SessionAuthentication, TokenAuthentication
from rest_framework.generics import CreateAPIView, DestroyAPIView, UpdateAPIView
from rest_framework import permissions
from rest_framework import generics
from rest_framework import status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from django.core import serializers
from django.utils.html import strip_tags
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters
from datetime import datetime
from django.conf import settings
from django.template.loader import render_to_string
import string
import random
import json

class MateriasAll(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        materias = Materias.objects.all()
        materias = MateriaSerializer(materias, many=True).data
        #Aquí convertimos los valores de nuevo a un array
        if not materias:
            return Response({},400)
        for materia in materias:
            materia["dias_json"] = json.loads(materia["dias_json"])

        return Response(materias, 200)

class MateriasView(generics.CreateAPIView):
    #Obtener usuario por ID
    # permission_classes = (permissions.IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        materia = get_object_or_404(Materias, id = request.GET.get("id"))
        materia = MateriaSerializer(materia, many=False).data
        materia["dias_json"] = json.loads(materia["dias_json"])
        return Response(materia, 200)
    
    #Registrar nuevo usuario
    @transaction.atomic
    def post(self, request, *args, **kwargs):

        materia = MateriaSerializer(data=request.data)
        isvalid=materia.is_valid()
        print (materia.errors)
        if isvalid:
    
            materia = Materias.objects.create(
                                            nrc= request.data["nrc"],
                                            nombre_materia= request.data["nombre_materia"],
                                            seccion= request.data["seccion"],
                                            hora_inicio= request.data["hora_inicio"],
                                            hora_fin= request.data["hora_fin"],
                                            salon= request.data["salon"],
                                            programa= request.data["programa"],
                                            profesor= request.data["profesor"],
                                            dias_json = json.dumps(request.data["dias_json"]))
            materia.save()

            return Response({"materia_created_id": materia.id }, 201)

        return Response(materia.errors, status=status.HTTP_400_BAD_REQUEST)
    
#Se agrega edicion y eliminar maestros
class MateriasViewEdit(generics.CreateAPIView): 
    permission_classes = (permissions.IsAuthenticated,)
    def put(self, request, *args, **kwargs):
        # iduser=request.data["id"]
        materia = get_object_or_404(Materias, id=request.data["id"])
        materia.nrc = request.data["nrc"]
        materia.nombre_materia = request.data["nombre_materia"]
        materia.seccion = request.data["seccion"]
        materia.hora_inicio = request.data["hora_inicio"]
        materia.hora_fin = request.data["hora_fin"]
        materia.salon = request.data["salon"]
        materia.programa = request.data["programa"]
        materia.profesor = request.data["profesor"]
        materia.dias_json = json.dumps(request.data["dias_json"])
        materia.save()
      
        materia = MateriaSerializer(materia, many=False).data

        return Response(materia,200)
    
    def delete(self, request, *args, **kwargs):
        profile = get_object_or_404(Materias, id=request.GET.get("id"))
        try:
            profile.user.delete()
            return Response({"details":"Materia eliminado"},200)
        except Exception as e:
            return Response({"details":"Algo pasó al eliminar"},400)