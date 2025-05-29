import streamlit as st
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Configuración de la app
st.set_page_config(layout="wide")
st.title("💧 Simulación Visual de Llenado y Vaciado de un Tanque")

# Parámetros de entrada
st.sidebar.header("🔧 Parámetros del sistema")
Q_in = st.sidebar.number_input("Caudal de entrada (m³/s)", value=0.01, step=0.001)
A_tanque = st.sidebar.number_input("Área de la base del tanque (m²)", value=1.0, step=0.1)
A_orificio = st.sidebar.number_input("Área del orificio de salida (m²)", value=0.01, step=0.001)
Cd = st.sidebar.number_input("Coeficiente de descarga (Cd)", value=0.6, step=0.05)
h0 = st.sidebar.number_input("Altura inicial del agua (m)", value=0.0, step=0.1)
altura_maxima = st.sidebar.number_input("Altura máxima del tanque (m)", value=1.5, step=0.1)
tiempo_max = st.sidebar.slider("Tiempo máximo (s)", 10, 300, 100)
paso_tiempo = st.sidebar.slider("Paso de tiempo (s)", 1, 10, 1)

# Constantes
g = 9.81
k = (Cd * A_orificio * np.sqrt(2 * g)) / A_tanque

# Simulación
tiempo = np.arange(0, tiempo_max + paso_tiempo, paso_tiempo)
altura = []
h = h0

for t in tiempo:
    Q_out = Cd * A_orificio * np.sqrt(2 * g * h) if h > 0 else 0
    dh_dt = (Q_in - Q_out) / A_tanque
    h += dh_dt * paso_tiempo
    h = max(h, 0)  # No dejar que baje de 0
    h = min(h, altura_maxima)  # No pasar de la altura máxima del tanque
    altura.append(h)

# Layout de 2 columnas: gráfico y tanque
col1, col2 = st.columns(2)

# 📈 Gráfico de Altura vs Tiempo
with col1:
    fig1, ax1 = plt.subplots()
    ax1.plot(tiempo, altura, color='blue', label='Altura del agua (m)')
    ax1.set_xlabel("Tiempo (s)")
    ax1.set_ylabel("Altura del agua (m)")
    ax1.set_title("Evolución de la altura del agua")
    ax1.grid(True)
    ax1.legend()
    st.pyplot(fig1)

# 🚰 Simulación visual del tanque
with col2:
    fig2, ax2 = plt.subplots(figsize=(2, 5))
    # Dibujar tanque
    tanque = patches.Rectangle((0.25, 0), 0.5, altura_maxima, linewidth=1, edgecolor='black', facecolor='none')
    ax2.add_patch(tanque)

    # Dibujar agua (última altura)
    nivel_actual = altura[-1]
    agua = patches.Rectangle((0.25, 0), 0.5, nivel_actual, linewidth=0, facecolor='skyblue')
    ax2.add_patch(agua)

    ax2.set_xlim(0, 1)
    ax2.set_ylim(0, altura_maxima)
    ax2.set_xticks([])
    ax2.set_yticks(np.linspace(0, altura_maxima, 6))
    ax2.set_title("Tanque (vista lateral)")
    ax2.set_ylabel("Altura (m)")
    st.pyplot(fig2)
