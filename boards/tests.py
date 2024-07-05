from django.test import TestCase

# Create your tests here.
from models import Board
board=Board(name='test',description='test board.')
board.save()
