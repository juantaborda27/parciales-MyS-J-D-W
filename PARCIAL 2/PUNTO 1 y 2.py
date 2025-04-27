import math
import matplotlib.pyplot as plt
import numpy as np
import time

# Parámetros del motor
V_nominal = 12
RPM_nominal = 4500

# Velocidad angular nominal (rad/s)
omega_nominal = (2 * math.pi * RPM_nominal) / 60

# Inicializar listas
tiempos = []
omega_R_list = []
omega_L_list = []

# Tiempo de simulación
tiempo_total = 5
dt = 1
t = 0

# Configurar la gráfica
plt.ion()
fig, ax = plt.subplots()
line_R, = ax.plot([], [], 'r-', label='Rueda Derecha (rad/s)')
line_L, = ax.plot([], [], 'b-', label='Rueda Izquierda (rad/s)')
ax.set_xlim(0, tiempo_total)
ax.set_ylim(0, omega_nominal + 50)
ax.set_xlabel('Tiempo (s)')
ax.set_ylabel('Velocidad Angular (rad/s)')
ax.set_title('Simulación Voltaje → Velocidad Motor')
ax.legend()
plt.grid(True)

# Simulación
while t <= tiempo_total:
    # Si se cierra la ventana de la gráfica, salir del bucle
    if not plt.fignum_exists(fig.number):
        print("✅ Simulación terminada.")
        break

    try:
        V_R = float(input(f"Ingrese voltaje para Rueda Derecha (0 a {V_nominal} V): "))
        V_L = float(input(f"Ingrese voltaje para Rueda Izquierda (0 a {V_nominal} V): "))

        if not (0 <= V_R <= V_nominal and 0 <= V_L <= V_nominal):
            print(f"⚠️ Voltajes fuera de rango. Ingrese valores entre 0 y {V_nominal} V.")
            continue

        omega_R = (V_R / V_nominal) * omega_nominal
        omega_L = (V_L / V_nominal) * omega_nominal

        print(f"⮕ Tiempo: {t:.1f} s")
        print(f"   ➜ Velocidad Rueda Derecha: {omega_R:.2f} rad/s")
        print(f"   ➜ Velocidad Rueda Izquierda: {omega_L:.2f} rad/s\n")

        tiempos.append(t)
        omega_R_list.append(omega_R)
        omega_L_list.append(omega_L)

        line_R.set_data(tiempos, omega_R_list)
        line_L.set_data(tiempos, omega_L_list)
        ax.relim()
        ax.autoscale_view()

        plt.pause(0.1)
        t += dt

    except ValueError:
        print("⚠️ Debes ingresar un número válido.\n")

# Mantener ventana al final
plt.ioff()
plt.show()
