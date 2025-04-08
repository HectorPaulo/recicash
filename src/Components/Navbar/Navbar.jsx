import GooeyNav from "/src/Components/GooeyNav/GooeyNav";

const Navbar = () => {
  const items = [
    { label: "Home", href: "/home" },
    { label: "Inicio", href: "#" },
    { label: "Cards", href: "#" },
    { label: "Panel", href: "#" },
    { label: "Movimientos", href: "#" },
    { label: "Preferencias", href: "#" },
  ];

  return (
    <div className="w-full bg-gray-800 p-4">
      <div style={{ height: 'auto', position: 'relative' }}>
        <GooeyNav
          items={items}
          animationTime={600}
          pCount={15}
          minDistance={20}
          maxDistance={42}
          maxRotate={75}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          timeVariance={300}
        />
      </div>
    </div>
  );
};

export default Navbar;