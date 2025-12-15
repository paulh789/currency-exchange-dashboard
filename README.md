**[English Version | Versión en Inglés](./README-EN.md)**

# Desafío Técnico: Dashboard de Cambio de Divisas (Next.js)
Esta aplicación web implementa un conversor de divisas y un dashboard de tasas de cambio utilizando Next.js 14 (App Router), TypeScript, Tailwind CSS y la API pública Frankfurter.

La arquitectura se centró en el rendimiento y la experiencia de usuario, realizando una única llamada a la API en el servidor y manejando todas las conversiones posteriores en el lado del cliente. El diseño se enfoca en el atractivo visual y la comodidad de uso, incluyendo las banderas de las entidades de las divisas.

## Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/paulh789/currency-exchange-dashboard.git
cd currency-exchange-dashboard

```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Ejecutar el proyecto en modo desarrollo:**
```bash
npm run dev
```

4. Abrir [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) en el navegador.


## Funcionalidad Bonus: Simulador de Costos de Transferencia

Esta función permite al usuario simular el impacto de una comisión porcentual o un cargo fijo aplicado a la cantidad de dinero a transferir, lo cual es común en empresas de transferencias monetarias al extranjero, por lo que se mantiene el enfoque en el usuario ofreciendo transparencia y confianza. 

## Uso de Inteligencia Artificial
Como este es mi primer proyecto usando las tecnologías requeridas, se utilizó la IA como un asistente de programación, preguntando por el funcionamiento de los componentes de React y generando plantillas iniciales de código, que luego fueron iteradas por esta y modificadas manualmente según mi visión del proyecto. Esto permitió escribir código de calidad que cumple con los estándares funcionales y de estilo buscados.

## Trade-Offs
El principal trade-off del proyecto es el rendimiento vs la precisión de las tasas, ya que se hace una única llamada a la API con USD como base, y en caso de requerir otra divisa como base de conversión se hacen los cálculos en el lado del cliente. Esto asegura un mejor rendimiento, ya que los cálculos son simplemente reglas de 3 simples, pero conlleva a que las tasas no estén en tiempo real, si no que se actualizan cada hora.

El otro trade-off importante es la priorización del diseño visual por sobre la completitud de divisas, ya que por temas de tiempo solo se usan las 13 divisas más importantes en lugar de todas las disponibles en la API Frankfurter.

## Posibles mejoras
Si contara con más tiempo para seguir desarrollando el proyecto, se podrían agregar las divisas restantes de la API y otras divisas como el peso chileno, y también se podría mejorar el formato de los valores numéricos agregando un separador de miles (ej: 1,000,000) para facilitar su lectura. Además, si bien estoy conforme con el diseño de la aplicación, me gustaría intentar organizar los componentes para que queden todos visibles al mismo tiempo sin tener de scrollear, como un verdadero dashboard.
