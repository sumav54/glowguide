import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Sun, Moon, Plus, X, GripVertical, ExternalLink, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import {
  products,
  routineStepOrder,
  routineStepLabels,
  type Product,
  type SkinType,
} from "@/data/products";
import { storeUrl, primaryStoreUrl } from "@/lib/storeLinks";

const skinTypes: (SkinType | "all")[] = ["all", "oily", "dry", "normal", "combination"];

/* ── Sortable routine item ── */
const SortableRoutineItem = ({
  product,
  onRemove,
}: {
  product: Product;
  onRemove: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-card rounded-lg border border-border p-3 group"
    >
      <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
        <GripVertical className="w-4 h-4" />
      </button>
      <img src={product.image} alt={product.name} loading="lazy" width={640} height={640} className="w-10 h-10 rounded-md object-cover bg-secondary shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground">{product.brand} · {product.category}</p>
      </div>
      <a
        href={primaryStoreUrl(product)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80 shrink-0"
        title="Buy now"
      >
        <ExternalLink className="w-4 h-4" />
      </a>
      <button onClick={onRemove} className="text-muted-foreground hover:text-destructive shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

/* ── Product picker card ── */
const PickerCard = ({ product, onAdd }: { product: Product; onAdd: () => void }) => (
  <div className="flex items-center gap-3 bg-card rounded-lg border border-border p-3 hover:border-primary/40 transition-colors">
    <img src={product.image} alt={product.name} loading="lazy" width={640} height={640} className="w-8 h-8 rounded-md object-cover bg-secondary shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium truncate">{product.name}</p>
      <p className="text-xs text-muted-foreground">{product.brand} · ₹{product.price.replace("₹", "")}</p>
      <div className="flex gap-1 mt-1 flex-wrap">
        {product.buyLinks.slice(0, 3).map((bl) => (
          <a
            key={bl.store}
            href={storeUrl(product, bl.store, bl.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            {bl.store}
          </a>
        ))}
      </div>
    </div>
    <Button size="sm" variant="ghost" onClick={onAdd} className="shrink-0 h-8 w-8 p-0">
      <Plus className="w-4 h-4" />
    </Button>
  </div>
);

/* ── Overlay card for drag ── */
const DragCard = ({ product }: { product: Product }) => (
  <div className="flex items-center gap-3 bg-card rounded-lg border-2 border-primary p-3 shadow-lg">
    <GripVertical className="w-4 h-4 text-muted-foreground" />
    <img src={product.image} alt={product.name} loading="lazy" width={640} height={640} className="w-10 h-10 rounded-md object-cover bg-secondary shrink-0" />
    <div>
      <p className="text-sm font-medium">{product.name}</p>
      <p className="text-xs text-muted-foreground">{product.brand}</p>
    </div>
  </div>
);

const RoutineBuilder = () => {
  const [searchParams] = useSearchParams();
  const initSkin = (searchParams.get("skin") as SkinType) || "all";
  const [filter, setFilter] = useState<SkinType | "all">(initSkin === "all" ? "all" : initSkin);

  const [morningRoutine, setMorningRoutine] = useState<Product[]>([]);
  const [nightRoutine, setNightRoutine] = useState<Product[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeList, setActiveList] = useState<"morning" | "night" | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const filtered = useMemo(() => {
    let items = products;
    if (filter !== "all") items = items.filter((p) => p.skinTypes.includes(filter));
    return items.sort((a, b) => {
      const ai = routineStepOrder.indexOf(a.routineStep!);
      const bi = routineStepOrder.indexOf(b.routineStep!);
      return ai - bi;
    });
  }, [filter]);

  const addToRoutine = (product: Product, list: "morning" | "night") => {
    const setter = list === "morning" ? setMorningRoutine : setNightRoutine;
    setter((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromRoutine = (id: string, list: "morning" | "night") => {
    const setter = list === "morning" ? setMorningRoutine : setNightRoutine;
    setter((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const reorder = (items: Product[]) => {
      const oldIndex = items.findIndex((p) => p.id === active.id);
      const newIndex = items.findIndex((p) => p.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return items;
      const next = [...items];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      return next;
    };

    if (morningRoutine.find((p) => p.id === active.id as string)) {
      setMorningRoutine(reorder);
    } else {
      setNightRoutine(reorder);
    }
    setActiveId(null);
  };

  const activeProduct =
    activeId
      ? morningRoutine.find((p) => p.id === activeId) || nightRoutine.find((p) => p.id === activeId)
      : null;

  const RoutineColumn = ({
    title,
    icon: Icon,
    items,
    listKey,
  }: {
    title: string;
    icon: typeof Sun;
    items: Product[];
    listKey: "morning" | "night";
  }) => (
    <div className="bg-secondary/30 rounded-xl p-4 border border-border">
      <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" /> {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Add products from the catalog →
        </p>
      ) : (
        <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((p) => (
              <SortableRoutineItem key={p.id} product={p} onRemove={() => removeFromRoutine(p.id, listKey)} />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display font-bold text-center mb-2"
        >
          Routine Builder
        </motion.h1>
        <p className="text-muted-foreground text-center mb-4">
          Drag, drop & build your perfect AM/PM skincare routine
        </p>
        <div className="flex justify-center mb-8">
          <Link to="/skin-analysis">
            <Button variant="outline" size="sm" className="rounded-full">
              <Camera className="mr-2 w-4 h-4" /> Don't know your skin type? Try AI Analysis
            </Button>
          </Link>
        </div>

        {/* Skin type filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {skinTypes.map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                filter === st
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Morning */}
            <RoutineColumn title="Morning Routine" icon={Sun} items={morningRoutine} listKey="morning" />

            {/* Product Catalog */}
            <div className="bg-card rounded-xl p-4 border border-border lg:row-span-1 max-h-[70vh] overflow-y-auto">
              <h3 className="font-display text-lg font-semibold mb-3 sticky top-0 bg-card pb-2">Product Catalog</h3>
              <div className="space-y-2">
                {filtered.map((p) => (
                  <div key={p.id}>
                    <PickerCard
                      product={p}
                      onAdd={() => {
                        /* show both options */
                      }}
                    />
                    <div className="flex gap-1 mt-1 ml-10">
                      <button
                        onClick={() => addToRoutine(p, "morning")}
                        className="text-[10px] px-2 py-0.5 rounded bg-accent text-accent-foreground hover:bg-accent/80 flex items-center gap-1"
                      >
                        <Sun className="w-3 h-3" /> AM
                      </button>
                      <button
                        onClick={() => addToRoutine(p, "night")}
                        className="text-[10px] px-2 py-0.5 rounded bg-accent text-accent-foreground hover:bg-accent/80 flex items-center gap-1"
                      >
                        <Moon className="w-3 h-3" /> PM
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Night */}
            <RoutineColumn title="Night Routine" icon={Moon} items={nightRoutine} listKey="night" />
          </div>

          <DragOverlay>{activeProduct ? <DragCard product={activeProduct} /> : null}</DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default RoutineBuilder;
