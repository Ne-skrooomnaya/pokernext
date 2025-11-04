    // app/users/[id]/page.js
    async function getUserData(id) {
      // Здесь будет логика получения данных пользователя из базы
      // const res = await fetch(`YOUR_API_ENDPOINT/users/${id}`);
      // if (!res.ok) throw new Error('Failed to fetch data');
      // return res.json();
      return { id, name: `Пользователь ${id}` }; // Заглушка
    }

    export default async function UserProfilePage({ params }) {
      const user = await getUserData(params.id);

      return (
        <div>
          <h1>Профиль пользователя: {user.name}</h1>
          <p>ID: {user.id}</p>
          {/* Другие данные пользователя */}
        </div>
      );
    }
