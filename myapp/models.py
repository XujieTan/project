from django.db import models

# Create your models here.
class Board(models.Model):
    name = models.CharField(max_length=30, unique=True)
    
    description = models.CharField(max_length=100)
    def __str__(self):
        return self.name