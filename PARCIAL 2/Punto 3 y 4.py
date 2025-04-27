import tkinter as tk
import math

ventana = tk.Tk()

frame_principal = tk.Frame(ventana)
frame_principal.pack(fill="both", expand=True)

frame_controles = tk.Frame(frame_principal)
frame_controles.pack(side="left", padx=10, pady=10, anchor="n")

frame_canvas = tk.Frame(frame_principal)
frame_canvas.pack(side="left", padx=10, pady=20)
ventana.title("Simulación de Robot Móvil")
ventana.geometry("1200x720")

canvas = tk.Canvas(frame_canvas, width=800, height=500, bg="white")
canvas.pack()

def dibujarCuadricula():
    paso = 35

    for x in range(0, 801, paso):
        canvas.create_line(x, 0, x, 500, fill="lightgray")
    for y in range(0, 501, paso):
        canvas.create_line(0, y, 800, y, fill="lightgray")
    
    canvas.create_line(385, 0, 385, 500, fill="black", width=1)  # Eje Y
    canvas.create_line(0, 245, 800, 245, fill="black", width=1)  # Eje X
    
    for i in range(-17, 18):  
        if i != 0:  
            canvas.create_text(385 + i * paso, 260, text=str(i * 10), font=("Arial", 8))  # Ejes X
            canvas.create_text(393, 250 - i * paso, text=str(i * 10), font=("Arial", 8))  # Ejes Y

x, y = 385, 245      # posición inicial
angulo = -90           # en grados
radio_robot = 10     # tamaño del robot

def dibujarRobot():
    canvas.delete("robot")
    
    canvas.create_oval(x - radio_robot, y - radio_robot,
                       x + radio_robot, y + radio_robot,
                       fill="lightblue", outline="blue", width=2, tags="robot")
    
    frente_x = x + radio_robot * math.cos(math.radians(angulo))
    frente_y = y + radio_robot * math.sin(math.radians(angulo))
    canvas.create_oval(frente_x - 2, frente_y - 2, frente_x + 2, frente_y + 2,
                       fill="red", tags="robot")
    
    separacionRueda = 7 
    for lado in [-1, 1]:  
        dx = separacionRueda * math.sin(math.radians(angulo)) * lado
        dy = -separacionRueda * math.cos(math.radians(angulo)) * lado
        rx = x + dx
        ry = y + dy

        rueda = 4
        rueda_dx = rueda * math.cos(math.radians(angulo))
        rueda_dy = rueda * math.sin(math.radians(angulo))
        canvas.create_line(rx - rueda_dx, ry - rueda_dy,rx + rueda_dx, ry + rueda_dy,fill="black", width=4, tags="robot")
def reiniciarSimulacion():
    global x, y, angulo
    x, y = 385, 245
    angulo = -90      
    entry_izq.delete(0, tk.END)
    entry_der.delete(0, tk.END)
    entry_izq.insert(0, "0")
    entry_der.insert(0, "0")
    dibujarRobot()

def mover():
    
    global x, y, angulo
    try:
        vl = float(entry_izq.get())
        vr = float(entry_der.get())
    except ValueError:
        return
    velocidad=0
    rotacion=0
    velocidad = (vr + vl) / 2
    rotacion = (vr - vl) / 5  

    angulo += rotacion
    x += velocidad * math.cos(math.radians(angulo))
    y += velocidad * math.sin(math.radians(angulo))
    if x - radio_robot < 0 or x + radio_robot > 800 or y - radio_robot < 0 or y + radio_robot > 500:
        print("Robot ha tocado el borde.")
        return 
    dibujarRobot()
    ventana.after(100, mover)

comandos = [] 
def manejar_tecla(event):
    tecla = event.keysym
    simbolo = ""  

    if tecla == "Up":
        comandos.append("arriba")
        simbolo = "⬆️"
    elif tecla == "Down":
        comandos.append("abajo")
        simbolo = "⬇️"
    elif tecla == "Left":
        comandos.append("izquierda")
        simbolo = "⬅️"
    elif tecla == "Right":
        comandos.append("derecha")
        simbolo = "➡️"

    if simbolo:
        lista_comandos.insert(tk.END, simbolo)  
    print("Comandos:", comandos) 

ventana.bind("<KeyPress>", manejar_tecla)
def ejecutar_comandos():
    global x, y, angulo

    if not comandos:
        return  

    comando = comandos.pop(0)
    lista_comandos.delete(0)          

    if comando == "arriba":
        if angulo == -90:
            y -= 20
        else:
            angulo = -90

    elif comando == "abajo":
        if angulo == 90:
            y += 20
        else:
            angulo = 90

    elif comando == "izquierda":
        if angulo == 180:
            x -= 20
        else:
            angulo = 180

    elif comando == "derecha":
        if angulo == 0:
            x += 20
        else:
            angulo = 0


    if x - radio_robot < 0 or x + radio_robot > 800 or y - radio_robot < 0 or y + radio_robot > 500:
        print("Robot tocó el borde")
        return

    dibujarRobot()
    ventana.after(200, ejecutar_comandos)

def limpiar_comandos():
    comandos.clear()
    lista_comandos.delete(0, tk.END)

tk.Label(frame_controles, text="Voltaje Motor Izquierdo:", font=("Arial", 10, "bold")).grid(row=1, column=0)
entry_izq = tk.Entry(frame_controles, font=("Arial", 10), bg="lightyellow")
entry_izq.insert(0, "0")
entry_izq.grid(row=1, column=1)

tk.Label(frame_controles, text="Voltaje Motor Derecho:", font=("Arial", 10, "bold")).grid(row=2, column=0)
entry_der = tk.Entry(frame_controles, font=("Arial", 10), bg="lightyellow")
entry_der.insert(0, "0")
entry_der.grid(row=2, column=1)

tk.Button(frame_controles, text="\u25B6 Iniciar", command=mover, font=("Arial", 10), bg="lightgreen").grid(row=4, columnspan=2, pady=20)

tk.Label(frame_controles, text="Establezca el recorrido a seguir usando las teclas \n de flecha del teclado para agregar comandos:",
         font=("Arial", 9,"bold")).grid(row=6, column=0, columnspan=2)
lista_comandos = tk.Listbox(frame_controles, height=10, width=20, font=("Arial", 10), bg="lightcyan")
lista_comandos.grid(row=8, column=0, columnspan=2, pady=10)

tk.Button(frame_controles, text="Ejecutar Comandos", command=ejecutar_comandos, font=("Arial", 10), bg="lightblue").grid(row=9, column=0, rowspan=2, pady=5)
tk.Button(frame_controles, text="Limpiar Comandos", command=limpiar_comandos, font=("Arial", 10), bg="lightgray").grid(row=9, column=1, rowspan=2, pady=5)
tk.Button(frame_controles, text="\u25A0 Detener y reiniciar", command=reiniciarSimulacion, font=("Arial", 10), bg="lightcoral").grid(row=11, columnspan=2)

dibujarCuadricula()
dibujarRobot()

ventana.mainloop()
