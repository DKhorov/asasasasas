import pygame
import sys
import random

pygame.init()

# --- Настройки ---
WINDOW_SIZE = (500, 500)
MAP_SIZE = (1000, 1000)
TILE_COLOR = (0, 180, 0)
PLAYER_COLOR = (0, 100, 255)
OBJECT_COLOR = (139, 69, 19)
FPS = 60

screen = pygame.display.set_mode(WINDOW_SIZE)
pygame.display.set_caption("Mini World Demo")

# --- Игрок ---
player_size = 40
player_pos = [MAP_SIZE[0] // 2, MAP_SIZE[1] // 2]
player_speed = 5

# --- Объекты на карте ---
objects = []
for _ in range(50):  # создаём 50 объектов
    x = random.randint(0, MAP_SIZE[0] - 50)
    y = random.randint(0, MAP_SIZE[1] - 50)
    objects.append(pygame.Rect(x, y, 40, 40))

# --- Камера ---
camera_x, camera_y = 0, 0

clock = pygame.time.Clock()

# --- Игровой цикл ---
while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # --- Управление ---
    keys = pygame.key.get_pressed()
    if keys[pygame.K_w]:
        player_pos[1] -= player_speed
    if keys[pygame.K_s]:
        player_pos[1] += player_speed
    if keys[pygame.K_a]:
        player_pos[0] -= player_speed
    if keys[pygame.K_d]:
        player_pos[0] += player_speed

    # Ограничиваем движение по карте
    player_pos[0] = max(0, min(player_pos[0], MAP_SIZE[0] - player_size))
    player_pos[1] = max(0, min(player_pos[1], MAP_SIZE[1] - player_size))

    # --- Камера следует за игроком ---
    camera_x = player_pos[0] - WINDOW_SIZE[0] // 2
    camera_y = player_pos[1] - WINDOW_SIZE[1] // 2

    camera_x = max(0, min(camera_x, MAP_SIZE[0] - WINDOW_SIZE[0]))
    camera_y = max(0, min(camera_y, MAP_SIZE[1] - WINDOW_SIZE[1]))

    # --- Рисуем мир ---
    screen.fill(TILE_COLOR)  # фон карты

    # Рисуем объекты (с учётом камеры)
    for obj in objects:
        rect = pygame.Rect(obj.x - camera_x, obj.y - camera_y, obj.width, obj.height)
        pygame.draw.rect(screen, OBJECT_COLOR, rect)

    # Рисуем игрока
    player_rect = pygame.Rect(
        player_pos[0] - camera_x,
        player_pos[1] - camera_y,
        player_size,
        player_size
    )
    pygame.draw.rect(screen, PLAYER_COLOR, player_rect)

    # --- Обновляем экран ---
    pygame.display.flip()
    clock.tick(FPS)
